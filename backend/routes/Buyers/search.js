import express from 'express';
import { poolPromise } from '../../db/sql.js';
import authenticateJWT from '../../middleware/auth.js';

const router = express.Router();

// GET /search - search products with filters, pagination, sorted by top rated
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const pool = await poolPromise;
    const {
      q = '', // search query
      category = '', // category name or id
      page = 1,
      pageSize = 10,
    } = req.query;

    const offset = (page - 1) * pageSize;

    // Determine if category is numeric id or name
    const isCategoryId = /^\d+$/.test(category);

    // Build base query with filters
    let baseQuery = `
      SELECT p.product_id, p.name, MAX(CAST(p.description AS NVARCHAR(MAX))) AS description, p.price, pi.image_url, p.is_rentable,
        ISNULL(AVG(r.rating), 0) AS average_rating
      FROM Products p
      LEFT JOIN Reviews r ON p.product_id = r.product_id
      LEFT JOIN Categories c ON p.category_id = c.category_id
      LEFT JOIN ProductImages pi ON p.product_id = pi.product_id
      WHERE 1=1
    `;

    const params = [];

    if (q) {
      baseQuery += ` AND (p.name LIKE @search OR p.description LIKE @search)`;
      params.push({ name: 'search', value: `%${q}%` });
    }

    if (category) {
      if (isCategoryId) {
        baseQuery += ` AND c.category_id = @categoryId`;
        params.push({ name: 'categoryId', value: parseInt(category) });
      } else {
        baseQuery += ` AND c.category_name = @categoryName`;
        params.push({ name: 'categoryName', value: category });
      }
    }

    baseQuery += `
      GROUP BY p.product_id, p.name, p.price, pi.image_url, p.is_rentable
      ORDER BY average_rating DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `;

    const request = pool.request();

    params.forEach(param => {
      request.input(param.name, param.value);
    });

    request.input('offset', parseInt(offset));
    request.input('pageSize', parseInt(pageSize));

    const result = await request.query(baseQuery);

    res.json({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      products: result.recordset,
    });
  } catch (error) {
    console.error('Error in search route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

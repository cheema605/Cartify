import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';
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
      type = 'all',
      minPrice = null,
      maxPrice = null,
      sort = 'rating_desc',
    } = req.query;

    const offset = (page - 1) * pageSize;

    // Determine if category is numeric id or name
    const isCategoryId = /^\d+$/.test(category);

    // Build base query with filters
    let baseQuery = `
      SELECT p.product_id, p.name, MAX(CAST(p.description AS NVARCHAR(MAX))) AS description, p.price, p.rent, p.is_sellable, pi.image_url, p.is_rentable,
        ISNULL(AVG(r.rating), 0) AS average_rating, p.created_at,
        CASE WHEN MAX(w.product_id) IS NOT NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS is_on_wishlist,
        d.discount_percent,
        CASE 
          WHEN d.discount_percent IS NOT NULL AND GETDATE() BETWEEN d.start_date AND d.end_date 
          THEN p.price * (1 - d.discount_percent / 100.0)
          ELSE p.price
        END AS discounted_price
      FROM Products p
      LEFT JOIN Reviews r ON p.product_id = r.product_id
      LEFT JOIN Categories c ON p.category_id = c.category_id
      LEFT JOIN ProductImages pi ON p.product_id = pi.product_id
      LEFT JOIN Wishlist w ON p.product_id = w.product_id AND w.user_id = @userId
      LEFT JOIN Discounts d ON p.product_id = d.product_id AND GETDATE() BETWEEN d.start_date AND d.end_date
      WHERE 1=1
    `;

    let countQuery = `
      SELECT COUNT(DISTINCT p.product_id) AS totalCount
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.category_id
      WHERE 1=1
    `;

    const params = [];

    if (q) {
      baseQuery += ` AND (p.name LIKE @search OR p.description LIKE @search)`;
      countQuery += ` AND (p.name LIKE @search OR p.description LIKE @search)`;
      params.push({ name: 'search', value: `%${q}%` });
    }

    if (category) {
      if (isCategoryId) {
        baseQuery += ` AND c.category_id = @categoryId`;
        countQuery += ` AND c.category_id = @categoryId`;
        params.push({ name: 'categoryId', value: parseInt(category) });
      } else {
        baseQuery += ` AND c.category_name = @categoryName`;
        countQuery += ` AND c.category_name = @categoryName`;
        params.push({ name: 'categoryName', value: category });
      }
    }

    if (type && type !== 'all') {
      baseQuery += ` AND (p.is_rentable = @isRentable)`;
      countQuery += ` AND (p.is_rentable = @isRentable)`;
      params.push({ name: 'isRentable', value: type === 'rental' });
    }

    if (minPrice !== null && minPrice !== '') {
      baseQuery += ` AND p.price >= @minPrice`;
      countQuery += ` AND p.price >= @minPrice`;
      params.push({ name: 'minPrice', value: parseFloat(minPrice) });
    }

    if (maxPrice !== null && maxPrice !== '') {
      baseQuery += ` AND p.price <= @maxPrice`;
      countQuery += ` AND p.price <= @maxPrice`;
      params.push({ name: 'maxPrice', value: parseFloat(maxPrice) });
    }

    // Sorting
    let orderByClause = 'ORDER BY average_rating DESC';
    if (sort === 'price_asc') {
      orderByClause = 'ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      orderByClause = 'ORDER BY p.price DESC';
    } else if (sort === 'newest') {
      orderByClause = 'ORDER BY p.created_at DESC';
    }

    baseQuery += `
      GROUP BY p.product_id, p.name, p.price, p.rent, p.is_sellable, pi.image_url, p.is_rentable, p.created_at, d.discount_percent, d.start_date, d.end_date
      ${orderByClause}
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `;

    const request = pool.request();

    params.forEach(param => {
      request.input(param.name, param.value);
    });

    request.input('userId', sql.Int, req.user);
    request.input('offset', parseInt(offset));
    request.input('pageSize', parseInt(pageSize));

    const countRequest = pool.request();

    params.forEach(param => {
      countRequest.input(param.name, param.value);
    });

    const [result, countResult] = await Promise.all([
      request.query(baseQuery),
      countRequest.query(countQuery)
    ]);

    const totalCount = countResult.recordset[0]?.totalCount || 0;

    res.json({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalCount: totalCount,
      products: result.recordset,
    });
  } catch (error) {
    console.error('Error in search route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';
import authenticateJWT from '../../middleware/auth.js';

const router = express.Router();

// GET /api/products?product_id=123 - Get product data by product_id including average rating
router.get('/products', authenticateJWT, async (req, res) => {
  const product_id = parseInt(req.query.product_id, 10);
  if (!product_id) {
    return res.status(400).json({ message: 'product_id query parameter is required and must be a number.' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('product_id', sql.Int, product_id)
      .query(`
        SELECT 
          p.product_id,
          p.seller_id,
          p.name,
          p.description,
          p.quantity,
          p.price,
          p.category_id,
          p.is_rentable,
          p.is_biddable,
          p.status,
          p.created_at,
          (
            SELECT TOP 1 pi.image_url 
            FROM ProductImages pi 
            WHERE pi.product_id = p.product_id
            ORDER BY pi.image_id
          ) AS image_url,
          ISNULL((
            SELECT AVG(CAST(r.rating AS FLOAT)) 
            FROM Reviews r 
            WHERE r.product_id = p.product_id
          ), 0) AS average_rating
        FROM Products p
        WHERE p.product_id = @product_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

export default router;

import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';
// import authenticateJWT from '../../middleware/auth.js';

const router = express.Router();

// GET / - get all product categories (public)
router.get('/categories', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT category_id, category_name FROM Categories');
    res.json({ categories: result.recordset });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

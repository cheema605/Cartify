import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';
import authenticateJWT from '../../middleware/auth.js';

const router = express.Router();

// GET /categories - get all product categories
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT category_id, category_name FROM Categories');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

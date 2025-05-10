import express from 'express'
import { sql } from '../../db/sql.js'
import authenticateJWT from '../../middleware/auth.js'

const router = express.Router()

// GET /reviews/:productId - Get reviews for a product
router.get('/get-review/:productId', async (req, res) => {
  const productId = req.params.productId

  try {
    console.log('Fetching reviews for product ID:', productId);
    const query = `
      SELECT r.review_id, r.rating, r.review_text, r.review_image, r.created_at,
             u.user_id, u.full_name
      FROM Reviews r
      JOIN Users u ON r.user_id = u.user_id
      WHERE r.product_id = @productId
      ORDER BY r.created_at DESC
    `

    const result = await sql.query(query, { productId })

    res.json({
      success: true,
      reviews: result.recordset
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' })
  }
})

// POST /reviews - Add a review for a product
router.post('/add-review/', authenticateJWT, async (req, res) => {
  const userId = req.user
  const { product_id, rating, review_text, review_image } = req.body

  if (!product_id || !rating) {
    return res.status(400).json({ success: false, message: 'Product ID and rating are required' })
  }

  try {
    console.log('Adding review for product ID:', product_id);
    const query = `
      INSERT INTO Reviews (user_id, product_id, rating, review_text, review_image)
      VALUES (@userId, @product_id, @rating, @review_text, @review_image)
    `

    await sql.query(query, { userId, product_id, rating, review_text, review_image })

    res.json({ success: true, message: 'Review added successfully' })
  } catch (error) {
    console.error('Error adding review:', error)
    res.status(500).json({ success: false, message: 'Failed to add review' })
  }
})

export default router

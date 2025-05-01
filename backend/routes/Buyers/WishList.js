import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';  // Assuming you have a poolPromise setup for db connection

const router = express.Router();

/*
  This route accepts a POST request to add a product to a user's wishlist.
  The request body must contain the following fields:
  
  Request Body (JSON):
  - user_id: (Int) ID of the user who is adding the product to the wishlist.
  - product_id: (Int) ID of the product being added to the wishlist.
  
  Example Request:
  POST /api/wishlist/add-to-wishlist
  {
    "user_id": 1,
    "product_id": 10
  }

  - If either the `user_id` or `product_id` is missing, the server responds with a 400 error.
  - The server also checks if the product is already in the wishlist for the given user, preventing duplicates.
*/

router.post('/add-to-wishlist', async (req, res) => {
    const { user_id, product_id } = req.body;

    // Validate input
    if (!user_id || !product_id) {
        return res.status(400).json({ message: 'User ID and Product ID are required.' });
    }

    try {
        const pool = await poolPromise;

        // Check if the product already exists in the user's wishlist
        const checkWishlist = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('product_id', sql.Int, product_id)
            .query('SELECT * FROM Wishlist WHERE user_id = @user_id AND product_id = @product_id');

        if (checkWishlist.recordset.length > 0) {
            return res.status(400).json({ message: 'Product already exists in the wishlist.' });
        }

        // Insert the new product into the wishlist
        await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('product_id', sql.Int, product_id)
            .query('INSERT INTO Wishlist (user_id, product_id) VALUES (@user_id, @product_id)');

        res.status(201).json({ message: 'Product added to wishlist successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add product to wishlist.', error: err.message });
    }
});

router.post("/remove-from-wishlist", async (req, res) => {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
        return res.status(400).json({ message: 'User ID and Product ID are required.' });
    }

    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('user_id', sql.Int, user_id)  // Correct data type
            .input('product_id', sql.Int, product_id)  // Correct data type
            .query('DELETE FROM Wishlist WHERE user_id = @user_id AND product_id = @product_id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Product not found in wishlist." });
        }

        res.json({ message: "Product removed from wishlist." });
    } catch (err) {
        console.error('Error removing product from wishlist:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

router.get("/get-wishlist/:user_id", async (req, res) => {
    const { user_id } = req.params;
  
    try {
      const pool = await poolPromise;
  
      const result = await pool
        .request()
        .input('user_id', sql.Int, user_id)
        .query(`
          SELECT 
            w.wishlist_id,
            p.product_id,
            p.name,
            p.description,
            p.price,
            p.quantity,
            (
              SELECT TOP 1 pi.image_url 
              FROM ProductImages pi 
              WHERE pi.product_id = p.product_id
              ORDER BY pi.image_id
            ) AS image_url
          FROM Wishlist w
          JOIN Products p ON w.product_id = p.product_id
          WHERE w.user_id = @user_id
        `);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "No wishlist found for this user." });
      }
  
      res.json(result.recordset);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  });
  


export default router;

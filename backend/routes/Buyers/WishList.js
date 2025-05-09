import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';
import authenticateJWT from '../../middleware/auth.js';

const router = express.Router();

/**
 * @route POST /api/wishlist/add-to-wishlist
 * @desc Add a product to user's wishlist
 * @access Protected
 */
router.post('/add-to-wishlist', authenticateJWT, async (req, res) => {
    const { product_id } = req.body;
    console.log("product_id", product_id);
    const user_id = req.user;

    if (!product_id) {
        return res.status(400).json({ message: 'Product ID is required.' });
    }

    try {
        const pool = await poolPromise;

        const checkWishlist = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('product_id', sql.Int, product_id)
            .query('SELECT * FROM Wishlist WHERE user_id = @user_id AND product_id = @product_id');

        if (checkWishlist.recordset.length > 0) {
            return res.status(400).json({ message: 'Product already exists in the wishlist.' });
        }

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

/**
 * @route POST /api/wishlist/remove-from-wishlist
 * @desc Remove a product from user's wishlist
 * @access Protected
 */
router.post("/remove-from-wishlist", authenticateJWT, async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user;

    if (!product_id) {
        return res.status(400).json({ message: 'Product ID is required.' });
    }

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('product_id', sql.Int, product_id)
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

/**
 * @route GET /api/wishlist/get-wishlist
 * @desc Get all wishlist products for the authenticated user
 * @access Protected
 */
router.get("/get-wishlist", authenticateJWT, async (req, res) => {
    const user_id = req.user;
    
    try {
        const pool = await poolPromise;

        const result = await pool.request()
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
            console.log("result", result.recordset);
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No wishlist found for this user." });
        }
        console.log("result", result.recordset);
        res.json(result.recordset);
    } catch (err) {
        console.log('Error fetching wishlist:', err);
        console.error('Error fetching wishlist:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

export default router;

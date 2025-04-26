import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';

const router = express.Router();

/**
 * Add a new discount to a product.
 * POST /api/discounts/add-discount
 */
router.post("/add-discount", async (req, res) => {
    const { product_id, discount_percent, start_date, end_date } = req.body;

    if (!product_id || !discount_percent) {
        return res.status(400).json({ message: "Product ID and discount percent are required." });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('product_id', sql.Int, product_id)
            .input('discount_percent', sql.Int, discount_percent)
            .input('start_date', sql.Date, start_date || null)
            .input('end_date', sql.Date, end_date || null)
            .query(`
                INSERT INTO Discounts (product_id, discount_percent, start_date, end_date)
                VALUES (@product_id, @discount_percent, @start_date, @end_date)
            `);

        res.status(201).json({ message: "Discount added successfully." });
    } catch (err) {
        console.error("Error adding discount:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

/**
 * Remove a discount by discount_id.
 * POST /api/discounts/remove-discount
 */
router.post("/remove-discount", async (req, res) => {
    const { discount_id } = req.body;

    if (!discount_id) {
        return res.status(400).json({ message: "Discount ID is required." });
    }

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('discount_id', sql.Int, discount_id)
            .query('DELETE FROM Discounts WHERE discount_id = @discount_id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Discount not found." });
        }

        res.json({ message: "Discount removed successfully." });
    } catch (err) {
        console.error("Error removing discount:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

/**
 * Get discount(s) for a specific product.
 * GET /api/discounts/get-discount/:product_id
 */
router.get("/get-discount/:product_id", async (req, res) => {
    const { product_id } = req.params;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('product_id', sql.Int, product_id)
            .query('SELECT * FROM Discounts WHERE product_id = @product_id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No discounts found for this product." });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching discount:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

export default router;

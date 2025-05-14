import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';
import authenticateJWT from '../../middleware/auth.js';

const router = express.Router();

// GET rental order details by rental_order_id
router.get("/get-rental-order/:rental_order_id", authenticateJWT, async (req, res) => {
    const { rental_order_id } = req.params;

    try {
        const pool = await poolPromise;

        // Query rental order details
        const rentalOrderResult = await pool.request()
            .input('rental_order_id', sql.Int, rental_order_id)
            .query('SELECT * FROM RentalOrders WHERE rental_order_id = @rental_order_id');

        if (rentalOrderResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Rental order not found.' });
        }

        const rentalOrder = rentalOrderResult.recordset[0];

        // Query rental order items
        const itemsResult = await pool.request()
            .input('rental_order_id', sql.Int, rental_order_id)
            .query(`
                SELECT roi.*, p.name, pi.image_url
                FROM RentalOrder_Items roi
                JOIN Products p ON roi.product_id = p.product_id
                LEFT JOIN (
                    SELECT product_id, MIN(image_url) AS image_url
                    FROM ProductImages
                    GROUP BY product_id
                ) pi ON p.product_id = pi.product_id
                WHERE roi.rental_order_id = @rental_order_id
            `);

        const rentalOrderItems = itemsResult.recordset;

        res.json({ rentalOrder, items: rentalOrderItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve rental order.', error: err.message });
    }
});

export default router;

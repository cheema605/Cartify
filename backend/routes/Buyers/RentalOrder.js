import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';
import authenticateJWT from '../../middleware/auth.js';

const router = express.Router();

// Existing routes for RentalOrders (not to be changed)
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

router.get("/my-rental-orders", authenticateJWT, async (req, res) => {
    try {
        const pool = await poolPromise;
        const userId = req.user;

        const result = await pool.request()
            .input('buyer_id', sql.Int, userId)
            .query('SELECT rental_order_id, rental_start_date, rental_period_days, status FROM RentalOrders WHERE buyer_id = @buyer_id ORDER BY rental_start_date DESC');

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve rental orders.', error: err.message });
    }
});

// New routes using Rentals table
router.get("/get-rental/:rental_id", authenticateJWT, async (req, res) => {
    const { rental_id } = req.params;

    try {
        const pool = await poolPromise;

        // Query rental details
        const rentalResult = await pool.request()
            .input('rental_id', sql.Int, rental_id)
            .query(`
                SELECT r.*, p.name, pi.image_url
                FROM Rentals r
                JOIN Products p ON r.product_id = p.product_id
                LEFT JOIN (
                    SELECT product_id, MIN(image_url) AS image_url
                    FROM ProductImages
                    GROUP BY product_id
                ) pi ON p.product_id = pi.product_id
                WHERE r.rental_id = @rental_id
            `);

        if (rentalResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Rental not found.' });
        }

        const rental = rentalResult.recordset[0];
        res.json({ rental });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve rental.', error: err.message });
    }
});

router.get("/my-rentals", authenticateJWT, async (req, res) => {
    try {
        const pool = await poolPromise;
        const userId = req.user;

        const result = await pool.request()
            .input('renter_id', sql.Int, userId)
            .query(`
                SELECT r.rental_id, r.rental_start_date, r.rental_end_date, r.status, p.name
                FROM Rentals r
                JOIN Products p ON r.product_id = p.product_id
                WHERE r.renter_id = @renter_id
                ORDER BY r.rental_start_date DESC
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve rentals.', error: err.message });
    }
});

export default router;

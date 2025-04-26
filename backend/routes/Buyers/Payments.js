import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';

const router = express.Router();

/**
 * Add a new payment
 * POST /api/payments/add-payment
 */
router.post("/add-payment", async (req, res) => {
    const { user_id, order_id, amount, payment_method } = req.body;

    // Validate input
    if (!user_id || !order_id || !amount || !payment_method) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (!["cod", "online"].includes(payment_method.toLowerCase())) {
        return res.status(400).json({ message: "Payment method must be either 'cod' or 'online'." });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('order_id', sql.Int, order_id)
            .input('amount', sql.Decimal(10, 2), amount)
            .input('payment_method', sql.VarChar(50), payment_method)
            .query(`
                INSERT INTO Payments (user_id, order_id, amount, payment_method)
                VALUES (@user_id, @order_id, @amount, @payment_method)
            `);

        res.status(201).json({ message: "Payment recorded successfully." });
    } catch (err) {
        console.error("Error adding payment:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

/**
 * Get payment by order ID
 * GET /api/payments/order/:order_id
 */
router.get("/order/:order_id", async (req, res) => {
    const { order_id } = req.params;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('order_id', sql.Int, order_id)
            .query('SELECT * FROM Payments WHERE order_id = @order_id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No payment found for this order." });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching payment by order:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

/**
 * Get all payments by a user
 * GET /api/payments/user/:user_id
 */
router.get("/user/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query('SELECT * FROM Payments WHERE user_id = @user_id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No payments found for this user." });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching payments by user:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


export const addPayment = async (order_id, user_id, amount, payment_method) => {
    try {
        const pool = await poolPromise;

        // Insert the payment details into the Payments table
        await pool.request()
            .input('order_id', sql.Int, order_id)
            .input('user_id', sql.Int, user_id)
            .input('amount', sql.Decimal(10, 2), amount)
            .input('payment_method', sql.VarChar(50), payment_method)
            .query('INSERT INTO Payments (user_id, order_id, amount, payment_method) VALUES (@user_id, @order_id, @amount, @payment_method)');

    } catch (err) {
        console.error('Error adding payment:', err);
        throw new Error('Payment processing failed.');
    }
};

export default router;

import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';
import { addPayment } from './Payments.js';
import { addPreference } from './Preferences.js';
import authenticateJWT from '../../middleware/auth.js';

const router = express.Router();

router.post("/create-order", authenticateJWT, async (req, res) => {
    const { buyer_id, products, total_price, payment_method } = req.body;

    if (!buyer_id || !Array.isArray(products) || products.length === 0 || !total_price || !payment_method) {
        return res.status(400).json({ message: 'Buyer ID, products, total price, and payment method are required.' });
    }

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('buyer_id', sql.Int, buyer_id)
            .input('total_price', sql.Decimal(10, 2), total_price)
            .input('status', sql.VarChar(20), 'pending')
            .query('INSERT INTO Orders (buyer_id, total_price, status) OUTPUT INSERTED.order_id VALUES (@buyer_id, @total_price, @status)');

        const order_id = result.recordset[0].order_id;

        for (let product of products) {
            await pool.request()
                .input('order_id', sql.Int, order_id)
                .input('product_id', sql.Int, product.product_id)
                .input('quantity', sql.Int, product.quantity)
                .input('price', sql.Decimal(10, 2), product.price)
                .query('INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES (@order_id, @product_id, @quantity, @price)');

            const categoryResult = await pool.request()
                .input('product_id', sql.Int, product.product_id)
                .query('SELECT category_id FROM Products WHERE product_id = @product_id');

            if (categoryResult.recordset.length > 0) {
                const category_id = categoryResult.recordset[0].category_id;
                await addPreference(buyer_id, category_id);
            }
        }

        await addPayment(order_id, buyer_id, total_price, payment_method);

        res.status(201).json({ message: 'Order created successfully!', order_id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create order.', error: err.message });
    }
});

router.get("/my-orders", authenticateJWT, async (req, res) => {
    try {
        const pool = await poolPromise;
        const userId = req.user;

        const result = await pool.request()
            .input('buyer_id', sql.Int, userId)
            .query('SELECT order_id, order_date, total_price FROM Orders WHERE buyer_id = @buyer_id ORDER BY order_date DESC');

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve orders.', error: err.message });
    }
});

router.get("/get-order/:order_id", authenticateJWT, async (req, res) => {
    const { order_id } = req.params;

    try {
        const pool = await poolPromise;

        const orderResult = await pool.request()
            .input('order_id', sql.Int, order_id)
            .query('SELECT * FROM Orders WHERE order_id = @order_id');

        if (orderResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        const order = orderResult.recordset[0];

        const itemsResult = await pool.request()
            .input('order_id', sql.Int, order_id)
            .query(`
                SELECT oi.*, p.name, pi.image_url
                FROM Order_Items oi
                JOIN Products p ON oi.product_id = p.product_id
                LEFT JOIN (
                    SELECT product_id, MIN(image_url) AS image_url
                    FROM ProductImages
                    GROUP BY product_id
                ) pi ON p.product_id = pi.product_id
                WHERE oi.order_id = @order_id
            `);

        const orderItems = itemsResult.recordset;

        res.json({ order, items: orderItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve order.', error: err.message });
    }
});

router.delete("/remove-order/:order_id", authenticateJWT, async (req, res) => {
    const { order_id } = req.params;

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('order_id', sql.Int, order_id)
            .query('DELETE FROM Order_Items WHERE order_id = @order_id');

        await pool.request()
            .input('order_id', sql.Int, order_id)
            .query('DELETE FROM Orders WHERE order_id = @order_id');

        res.status(200).json({ message: 'Order and its items removed successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to remove order.', error: err.message });
    }
});

router.put('/update-order/:order_id', authenticateJWT, async (req, res) => {
    const { order_id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Missing order status.' });
    }

    try {
        const pool = await poolPromise;
        const request = pool.request();

        const result = await request
            .input('order_id', sql.Int, order_id)
            .input('status', sql.VarChar, status)
            .query(`
                UPDATE Orders
                SET status = @status
                WHERE order_id = @order_id
            `);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: `Order status updated to \${status}.` });
        } else {
            res.status(404).json({ message: 'Order not found.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update order status.', error: error.message });
    }
});

export default router;

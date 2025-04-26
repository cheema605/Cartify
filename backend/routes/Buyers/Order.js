import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';  // Assuming you have a poolPromise setup for db connection
import { addPayment } from './Payments.js';  // Import the add payment function

const router = express.Router();

// Route to create an order
router.post("/create-order", async (req, res) => {
    const { buyer_id, products, total_price, payment_method } = req.body;

    // Validate input
    if (!buyer_id || !products || !total_price || !payment_method) {
        return res.status(400).json({ message: 'Buyer ID, products, total price, and payment method are required.' });
    }

    try {
        const pool = await poolPromise;

        // Step 1: Insert order into the Orders table
        const result = await pool.request()
            .input('buyer_id', sql.Int, buyer_id)
            .input('total_price', sql.Decimal(10, 2), total_price)
            .input('status', sql.VarChar(20), 'pending')
            .query('INSERT INTO Orders (buyer_id, total_price, status) OUTPUT INSERTED.order_id VALUES (@buyer_id, @total_price, @status)');

        const order_id = result.recordset[0].order_id;

        // Step 2: Insert products into the Order_Items table
        for (let product of products) {
            await pool.request()
                .input('order_id', sql.Int, order_id)
                .input('product_id', sql.Int, product.product_id)
                .input('quantity', sql.Int, product.quantity)
                .input('price', sql.Decimal(10, 2), product.price)
                .query('INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES (@order_id, @product_id, @quantity, @price)');
        }

        // Step 3: Trigger the payment route (you can adjust this based on your payment system)
        await addPayment(order_id, buyer_id, total_price, payment_method);

        res.status(201).json({ message: 'Order created successfully!', order_id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create order.', error: err.message });
    }
});



// Route to get order details by order ID
router.get("/get-order/:order_id", async (req, res) => {
    const { order_id } = req.params;

    try {
        const pool = await poolPromise;

        // Step 1: Get the order details
        const orderResult = await pool.request()
            .input('order_id', sql.Int, order_id)
            .query('SELECT * FROM Orders WHERE order_id = @order_id');

        if (orderResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        const order = orderResult.recordset[0];

        // Step 2: Get the items in the order
        const itemsResult = await pool.request()
            .input('order_id', sql.Int, order_id)
            .query('SELECT * FROM Order_Items WHERE order_id = @order_id');

        const orderItems = itemsResult.recordset;

        // Return the order with its items
        res.json({ order, items: orderItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve order.', error: err.message });
    }
});



// Route to remove an order by order ID
router.delete("/remove-order/:order_id", async (req, res) => {
    const { order_id } = req.params;

    try {
        const pool = await poolPromise;

        // Step 1: Delete items from Order_Items table
        await pool.request()
            .input('order_id', sql.Int, order_id)
            .query('DELETE FROM Order_Items WHERE order_id = @order_id');

        // Step 2: Delete the order from Orders table
        await pool.request()
            .input('order_id', sql.Int, order_id)
            .query('DELETE FROM Orders WHERE order_id = @order_id');

        res.status(200).json({ message: 'Order and its items removed successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to remove order.', error: err.message });
    }
});


export default router;


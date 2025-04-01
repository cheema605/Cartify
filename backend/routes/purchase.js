import express from "express";
import { sql, poolPromise } from "../db/sql.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { user_id, items } = req.body; // items = [{ product_id, quantity }]
    
    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Invalid request. User ID and items are required." });
    }

    try {
        const pool = await poolPromise;
        let totalAmount = 0;
        const orderItems = [];

        // Validate products and calculate total cost
        for (const item of items) {
            const { product_id, quantity } = item;
            const productResult = await pool.request()
                .input("product_id", sql.Int, product_id)
                .query("SELECT price, stock_quantity, store_id FROM Products WHERE product_id = @product_id");

            if (productResult.recordset.length === 0) {
                return res.status(400).json({ message: `Product ID ${product_id} not found.` });
            }

            const { price, stock_quantity, store_id } = productResult.recordset[0];

            if (stock_quantity < quantity) {
                return res.status(400).json({ message: `Insufficient stock for product ID ${product_id}.` });
            }

            totalAmount += price * quantity;
            orderItems.push({ product_id, quantity, price, store_id });
        }

        // Create order
        const orderResult = await pool.request()
            .input("user_id", sql.Int, user_id)
            .input("total_amount", sql.Decimal(10, 2), totalAmount)
            .query(`INSERT INTO Orders (user_id, total_amount) OUTPUT INSERTED.order_id VALUES (@user_id, @total_amount)`);

        const order_id = orderResult.recordset[0].order_id;

        // Insert order items and update stock
        for (const item of orderItems) {
            await pool.request()
                .input("order_id", sql.Int, order_id)
                .input("product_id", sql.Int, item.product_id)
                .input("quantity", sql.Int, item.quantity)
                .input("price", sql.Decimal(10, 2), item.price)
                .query(`INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES (@order_id, @product_id, @quantity, @price)`);

            await pool.request()
                .input("product_id", sql.Int, item.product_id)
                .input("quantity", sql.Int, item.quantity)
                .query("UPDATE Products SET stock_quantity = stock_quantity - @quantity WHERE product_id = @product_id");
        }

        res.json({ message: "Order placed successfully!", order_id, total_amount: totalAmount });
    } catch (err) {
        console.error("Error processing order:", err);
        res.status(500).json({ message: "Error processing order.", error: err.message });
    }
});

export default router;

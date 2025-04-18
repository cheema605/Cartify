import express from "express";
import { sql, poolPromise } from "../db/sql.js";

const router = express.Router();

router.post("/checkout", async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        const pool = await poolPromise;

        // Get cart items
        const cartResult = await pool.request()
            .input("user_id", sql.Int, user_id)
            .query("SELECT product_id, quantity FROM Cart WHERE user_id = @user_id");

        if (cartResult.recordset.length === 0) {
            return res.status(400).json({ message: "Cart is empty." });
        }

        let totalAmount = 0;
        const orderItems = [];

        // Validate stock and calculate total price
        for (const item of cartResult.recordset) {
            const productResult = await pool.request()
                .input("product_id", sql.Int, item.product_id)
                .query("SELECT price, stock_quantity FROM Products WHERE product_id = @product_id");

            if (productResult.recordset.length === 0) {
                return res.status(400).json({ message: `Product ID ${item.product_id} not found.` });
            }

            const { price, stock_quantity } = productResult.recordset[0];

            if (stock_quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product ID ${item.product_id}.` });
            }

            totalAmount += price * item.quantity;
            orderItems.push({ ...item, price });
        }

        // Create order
        const orderResult = await pool.request()
            .input("user_id", sql.Int, user_id)
            .input("total_amount", sql.Decimal(10, 2), totalAmount)
            .query("INSERT INTO Orders (user_id, total_amount) OUTPUT INSERTED.order_id VALUES (@user_id, @total_amount)");

        const order_id = orderResult.recordset[0].order_id;

        // Insert into Order_Items and update stock
        for (const item of orderItems) {
            await pool.request()
                .input("order_id", sql.Int, order_id)
                .input("product_id", sql.Int, item.product_id)
                .input("quantity", sql.Int, item.quantity)
                .input("price", sql.Decimal(10, 2), item.price)
                .query("INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES (@order_id, @product_id, @quantity, @price)");

            await pool.request()
                .input("product_id", sql.Int, item.product_id)
                .input("quantity", sql.Int, item.quantity)
                .query("UPDATE Products SET stock_quantity = stock_quantity - @quantity WHERE product_id = @product_id");
        }

        // Clear the user's cart
        await pool.request()
            .input("user_id", sql.Int, user_id)
            .query("DELETE FROM Cart WHERE user_id = @user_id");

        res.json({ message: "Order placed successfully!", order_id, total_amount: totalAmount });

    } catch (err) {
        console.error("Error processing checkout:", err);
        res.status(500).json({ message: "Error processing checkout.", error: err.message });
    }
});

export default router;

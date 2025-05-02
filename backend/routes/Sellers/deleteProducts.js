import express from "express";
import upload from "../../db/multer.js";
import { sql, poolPromise } from "../../db/sql.js";

const router = express.Router();

router.delete("/:product_id", async (req, res) => {
    const { product_id } = req.params;
  
    if (!product_id)
      return res.status(400).json({ message: "Product ID is required." });
  
    try {
      const pool = await poolPromise;
  
      // Check if product exists
      const productResult = await pool.request()
        .input("product_id", sql.Int, product_id)
        .query("SELECT * FROM Products WHERE product_id = @product_id");
  
      if (productResult.recordset.length === 0)
        return res.status(404).json({ message: "Product not found." });
  
      // Check for active orders
      const activeOrders = await pool.request()
        .input("product_id", sql.Int, product_id)
        .query(`
          SELECT oi.order_id
          FROM Order_Items oi
          JOIN Orders o ON oi.order_id = o.order_id
          WHERE oi.product_id = @product_id
          AND o.status NOT IN ('Delivered', 'Cancelled')
        `);
  
      if (activeOrders.recordset.length > 0) {
        return res.status(403).json({
          message: "Cannot delete product with active orders."
        });
      }
  
      // Delete product images
      await pool.request()
        .input("product_id", sql.Int, product_id)
        .query("DELETE FROM ProductImages WHERE product_id = @product_id");
  
      // Delete return policy if present
      await pool.request()
        .input("product_id", sql.Int, product_id)
        .query("DELETE FROM ReturnPolicies WHERE product_id = @product_id");
  
      // Finally, delete the product itself
      await pool.request()
        .input("product_id", sql.Int, product_id)
        .query("DELETE FROM Products WHERE product_id = @product_id");
  
      res.status(200).json({ message: "Product permanently deleted." });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete product.", error: err.message });
    }
  });


  export default router;
  
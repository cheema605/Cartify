import express from "express";
import multer from "multer";
import { sql, poolPromise } from "../../db/sql.js";

const router = express.Router();

// Multer config for in-memory image storage
const storage = multer.memoryStorage();
const upload = multer({ storage });






/*
  This route updates product details and optionally replaces product images.

  Fields (form-data):
    - product_id:       (required) ID of the product to update
    - name, description, price, quantity, category_id (optional)
    - images:           New image files to replace existing ones (optional)

  Example usage:
    - Send form-data with updated fields and images (if any).
*/

router.put("/", upload.array("images", 10), async (req, res) => {
  const { product_id, name, description, price, quantity, category_id } = req.body;
  const images = req.files;

  console.log("BODY:", req.body);
  console.log("FILES:", req.files);


  if (!product_id) {
    return res.status(400).json({ message: "Product ID is required." });
  }

  try {
    const pool = await poolPromise;

    // Check if product exists
    const existing = await pool.request()
      .input("product_id", sql.Int, product_id)
      .query("SELECT * FROM Products WHERE product_id = @product_id");

    if (existing.recordset.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Update product fields
    await pool.request()
      .input("product_id", sql.Int, product_id)
      .input("name", sql.NVarChar, name || existing.recordset[0].name)
      .input("description", sql.NVarChar, description || existing.recordset[0].description)
      .input("price", sql.Decimal(10, 2), price || existing.recordset[0].price)
      .input("category_id", sql.Int, category_id || existing.recordset[0].category_id)
      .input("quantity", sql.Int, quantity || existing.recordset[0].quantity)
      .query(`
        UPDATE Products
        SET name = @name,
            description = @description,
            price = @price,
            category_id = @category_id,
            quantity = @quantity
        WHERE product_id = @product_id
      `);

    // If new images were uploaded, replace existing ones
    if (images.length > 0) {
      await pool.request()
        .input("product_id", sql.Int, product_id)
        .query("DELETE FROM ProductImages WHERE product_id = @product_id");

      for (const file of images) {
        await pool.request()
          .input("product_id", sql.Int, product_id)
          .input("image_data", sql.VarBinary(sql.MAX), file.buffer)
          .query(`
            INSERT INTO ProductImages (product_id, image_data)
            VALUES (@product_id, @image_data)
          `);
      }
    }

    res.status(200).json({ message: "Product updated successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product.", error: err.message });
  }
});

export default router;

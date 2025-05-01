import express from "express";
import upload from "../../db/multer.js"; // uses CloudinaryStorage
import { sql, poolPromise } from "../../db/sql.js";

const router = express.Router();

// Route to update product details and images
router.put("/:product_id", upload.array("images", 10), async (req, res) => {
  const { product_id } = req.params;  // Get product ID from route parameter
  const { name, description, price, quantity, category_id } = req.body;
  const images = req.files;

  // Validation: Ensure product ID is provided and is valid
  if (!product_id)
    return res.status(400).json({ message: "Product ID is required." });

  // Check if the required fields are present
  if (!name || !price || !quantity)
    return res.status(400).json({ message: "Required fields missing." });

  try {
    const pool = await poolPromise;

    // Check if the product exists in the database
    const existingProduct = await pool.request()
      .input("product_id", sql.Int, product_id)
      .query("SELECT * FROM Products WHERE product_id = @product_id");

    if (existingProduct.recordset.length === 0)
      return res.status(404).json({ message: "Product not found." });

    // Update product details
    await pool.request()
      .input("product_id", sql.Int, product_id)
      .input("name", sql.NVarChar, name || existingProduct.recordset[0].name)
      .input("description", sql.NVarChar, description || existingProduct.recordset[0].description)
      .input("price", sql.Decimal(10, 2), price || existingProduct.recordset[0].price)
      .input("category_id", sql.Int, category_id || existingProduct.recordset[0].category_id)
      .input("quantity", sql.Int, quantity || existingProduct.recordset[0].quantity)
      .query(`
        UPDATE Products
        SET name = @name,
            description = @description,
            price = @price,
            category_id = @category_id,
            quantity = @quantity
        WHERE product_id = @product_id
      `);

    // If no images were uploaded, delete all existing images
    if (images.length === 0) {
      await pool.request()
        .input("product_id", sql.Int, product_id)
        .query("DELETE FROM ProductImages WHERE product_id = @product_id");
      return res.status(200).json({ message: "Product updated successfully, images removed." });
    }

    // If new images were uploaded, replace old images
    // Delete existing images for the product
    await pool.request()
      .input("product_id", sql.Int, product_id)
      .query("DELETE FROM ProductImages WHERE product_id = @product_id");

    // Insert new images into the ProductImages table
    for (const file of images) {
      const cloudinaryURL = file.path;  // Assuming Cloudinary's path is available as `file.path`

      if (!cloudinaryURL) {
        return res.status(500).json({ message: "Failed to upload image to Cloudinary." });
      }

      await pool.request()
        .input("product_id", sql.Int, product_id)
        .input("image_url", sql.VarChar, cloudinaryURL)
        .query(`
          INSERT INTO ProductImages (product_id, image_url)
          VALUES (@product_id, @image_url)
        `);
    }

    res.status(200).json({ message: "Product updated successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product.", error: err.message });
  }
});

export default router;

import express from "express";
import upload from "../../db/multer.js";
import { sql, poolPromise } from "../../db/sql.js";

const router = express.Router();

router.put("/:product_id", upload.array("images", 10), async (req, res) => {
  const { product_id } = req.params;
  const {
    name,
    description,
    price,
    quantity,
    category_id,
    is_rentable,
    is_biddable,
    daily_late_fee,
    damage_fee
  } = req.body;
  const images = req.files;

  if (!product_id)
    return res.status(400).json({ message: "Product ID is required." });

  if (!name || !price || !quantity)
    return res.status(400).json({ message: "Required fields missing." });

  try {
    const pool = await poolPromise;

    // Get existing product
    const existingProduct = await pool.request()
      .input("product_id", sql.Int, product_id)
      .query("SELECT * FROM Products WHERE product_id = @product_id");

    if (existingProduct.recordset.length === 0)
      return res.status(404).json({ message: "Product not found." });

    // Update Products table
    await pool.request()
      .input("product_id", sql.Int, product_id)
      .input("name", sql.NVarChar, name)
      .input("description", sql.NVarChar, description || existingProduct.recordset[0].description)
      .input("price", sql.Decimal(10, 2), price)
      .input("category_id", sql.Int, category_id || existingProduct.recordset[0].category_id)
      .input("quantity", sql.Int, quantity)
      .input("is_rentable", sql.Bit, is_rentable ?? existingProduct.recordset[0].is_rentable)
      .input("is_biddable", sql.Bit, is_biddable ?? existingProduct.recordset[0].is_biddable)
      .query(`
        UPDATE Products
        SET name = @name,
            description = @description,
            price = @price,
            category_id = @category_id,
            quantity = @quantity,
            is_rentable = @is_rentable,
            is_biddable = @is_biddable
        WHERE product_id = @product_id
      `);

    // Handle ReturnPolicies
    if (is_rentable && daily_late_fee && damage_fee) {
      const policyResult = await pool.request()
        .input("product_id", sql.Int, product_id)
        .query("SELECT * FROM ReturnPolicies WHERE product_id = @product_id");

      if (policyResult.recordset.length > 0) {
        // Update existing policy
        await pool.request()
          .input("product_id", sql.Int, product_id)
          .input("daily_late_fee", sql.Decimal(10, 2), daily_late_fee)
          .input("damage_fee", sql.Decimal(10, 2), damage_fee)
          .query(`
            UPDATE ReturnPolicies
            SET daily_late_fee = @daily_late_fee,
                damage_fee = @damage_fee
            WHERE product_id = @product_id
          `);
      } else {
        // Insert new policy
        await pool.request()
          .input("product_id", sql.Int, product_id)
          .input("daily_late_fee", sql.Decimal(10, 2), daily_late_fee)
          .input("damage_fee", sql.Decimal(10, 2), damage_fee)
          .query(`
            INSERT INTO ReturnPolicies (product_id, daily_late_fee, damage_fee, created_at)
            VALUES (@product_id, @daily_late_fee, @damage_fee, GETDATE())
          `);
      }
    }

    // Update images
    if (images.length === 0) {
      await pool.request()
        .input("product_id", sql.Int, product_id)
        .query("DELETE FROM ProductImages WHERE product_id = @product_id");

      return res.status(200).json({ message: "Product updated, images removed." });
    }

    await pool.request()
      .input("product_id", sql.Int, product_id)
      .query("DELETE FROM ProductImages WHERE product_id = @product_id");

    for (const file of images) {
      const cloudinaryURL = file.path;
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

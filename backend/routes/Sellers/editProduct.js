import express from "express";
import upload from "../../db/multer.js";
import { sql, poolPromise } from "../../db/sql.js";
import authenticateJWT from "../../middleware/auth.js";

const router = express.Router();

router.put("/:product_id", authenticateJWT, upload.array("images", 10), async (req, res) => {
  const { product_id } = req.params;
  const user_id = req.user;
  const {
    name,
    description,
    price,
    quantity,
    category,
    is_rentable,
    is_biddable,
    status,
    is_sellable,
    rent,
    daily_late_fee,
    damage_fee
  } = req.body;
  const images = req.files;

  if (!product_id) {
    return res.status(400).json({ message: "Product ID is required." });
  }

  // Check if at least one updatable field is present
  if (
    !name &&
    !description &&
    !price &&
    !quantity &&
    !category &&
    typeof is_rentable === 'undefined' &&
    typeof is_biddable === 'undefined' &&
    !status &&
    typeof is_sellable === 'undefined' &&
    !rent &&
    !daily_late_fee &&
    !damage_fee &&
    (!images || images.length === 0)
  ) {
    return res.status(400).json({ message: "At least one field must be provided to update." });
  }

  try {
    const pool = await poolPromise;

    // First verify that the product belongs to the seller
    const sellerResult = await pool.request()
      .input("user_id", sql.Int, user_id)
      .query("SELECT seller_id FROM Sellers WHERE user_id = @user_id");

    if (sellerResult.recordset.length === 0) {
      return res.status(403).json({ message: "You are not authorized to edit products." });
    }

    const seller_id = sellerResult.recordset[0].seller_id;

    // Check if product exists and belongs to the seller
    const existingProductResult = await pool.request()
      .input("product_id", sql.Int, product_id)
      .input("seller_id", sql.Int, seller_id)
      .query("SELECT * FROM Products WHERE product_id = @product_id AND seller_id = @seller_id");

    if (existingProductResult.recordset.length === 0) {
      return res.status(404).json({ message: "Product not found or you don't have permission to edit it." });
    }

    const existingProduct = existingProductResult.recordset[0];

    // Get category_id if category name is provided
    let category_id = existingProduct.category_id;
    if (category) {
      const categoryResult = await pool.request()
        .input("category_name", sql.NVarChar, category.trim())
        .query("SELECT category_id FROM Categories WHERE LOWER(category_name) = LOWER(@category_name)");

      if (categoryResult.recordset.length > 0) {
        category_id = categoryResult.recordset[0].category_id;
      } else {
        return res.status(400).json({ message: "Category not found. Please use an existing category." });
      }
    }

    // Prepare update values, using provided values or falling back to existing
    const updateName = typeof name !== 'undefined' ? name : existingProduct.name;
    const updateDescription = typeof description !== 'undefined' ? description : existingProduct.description;
    const updatePrice = typeof price !== 'undefined' ? parseFloat(price) : parseFloat(existingProduct.price);
    const updateQuantity = typeof quantity !== 'undefined' ? parseInt(quantity) : parseInt(existingProduct.quantity);
    // Parse is_sellable and is_rentable as booleans
    const rentable = (is_rentable === true || is_rentable === 'true' || is_rentable === 1 || is_rentable === '1');
    const sellable = (is_sellable === true || is_sellable === 'true' || is_sellable === 1 || is_sellable === '1');

    const updateIsRentable = typeof is_rentable !== 'undefined' ? rentable : existingProduct.is_rentable;
    const updateIsBiddable = typeof is_biddable !== 'undefined' ? is_biddable : existingProduct.is_biddable;
    const updateStatus = typeof status !== 'undefined' ? status : existingProduct.status;
    const updateIsSellable = typeof is_sellable !== 'undefined' ? sellable : existingProduct.is_sellable;
    const updateRent = typeof rent !== 'undefined' ? parseFloat(rent) : parseFloat(existingProduct.rent);

    // Validate numeric fields if provided
    if (typeof price !== 'undefined' && isNaN(updatePrice)) {
      return res.status(400).json({ message: "Price must be a valid number." });
    }
    if (typeof quantity !== 'undefined' && isNaN(updateQuantity)) {
      return res.status(400).json({ message: "Quantity must be a valid number." });
    }
    if (typeof rent !== 'undefined' && isNaN(updateRent)) {
      return res.status(400).json({ message: "Rent must be a valid number." });
    }

    // Update Products table
    await pool.request()
      .input("product_id", sql.Int, product_id)
      .input("name", sql.NVarChar, updateName)
      .input("description", sql.NVarChar, updateDescription)
      .input("price", sql.Decimal(10, 2), updatePrice)
      .input("category_id", sql.Int, category_id)
      .input("quantity", sql.Int, updateQuantity)
      .input("is_rentable", sql.Bit, updateIsRentable)
      .input("is_biddable", sql.Bit, updateIsBiddable)
      .input("status", sql.NVarChar, updateStatus)
      .input("is_sellable", sql.Bit, updateIsSellable)
      .input("rent", sql.Decimal(10, 2), updateRent)
      .query(`
        UPDATE Products
        SET name = @name,
            description = @description,
            price = @price,
            category_id = @category_id,
            quantity = @quantity,
            is_rentable = @is_rentable,
            is_biddable = @is_biddable,
            status = @status,
            is_sellable = @is_sellable,
            rent = @rent
        WHERE product_id = @product_id
      `);

    // Handle ReturnPolicies if any rental-related fields are provided
    const parsedDailyLateFee = daily_late_fee ? parseFloat(daily_late_fee) : null;
    const parsedDamageFee = damage_fee ? parseFloat(damage_fee) : null;
    if (updateIsRentable && parsedDailyLateFee !== null && parsedDamageFee !== null) {
      const policyResult = await pool.request()
        .input("product_id", sql.Int, product_id)
        .query("SELECT * FROM ReturnPolicies WHERE product_id = @product_id");

      if (policyResult.recordset.length > 0) {
        // Update existing policy
        await pool.request()
          .input("product_id", sql.Int, product_id)
          .input("daily_late_fee", sql.Decimal(10, 2), parsedDailyLateFee)
          .input("damage_fee", sql.Decimal(10, 2), parsedDamageFee)
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
          .input("daily_late_fee", sql.Decimal(10, 2), parsedDailyLateFee)
          .input("damage_fee", sql.Decimal(10, 2), parsedDamageFee)
          .query(`
            INSERT INTO ReturnPolicies (product_id, daily_late_fee, damage_fee, created_at)
            VALUES (@product_id, @daily_late_fee, @damage_fee, GETDATE())
          `);
      }
    }

    // Handle images if provided
    if (images && images.length > 0) {
      // Delete existing images
      await pool.request()
        .input("product_id", sql.Int, product_id)
        .query("DELETE FROM ProductImages WHERE product_id = @product_id");

      // Insert new images
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
    }

    res.status(200).json({ message: "Product updated successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product.", error: err.message });
  }
});

export default router;

import express from "express";
import upload from "../../db/multer.js";
import { sql, poolPromise } from "../../db/sql.js";

const router = express.Router();

router.post("/", upload.array("images", 10), async (req, res) => {
  const {
    user_id,
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

  if (!user_id || !name || !price || !quantity)
    return res.status(400).json({ message: "Required fields missing." });

  try {
    const pool = await poolPromise;

    // Check if seller exists
    const sellerQuery = await pool.request()
      .input("user_id", sql.Int, user_id)
      .query("SELECT seller_id FROM Sellers WHERE user_id = @user_id");

    if (sellerQuery.recordset.length === 0)
      return res.status(400).json({ message: "Store does not exist for this user." });

    const seller_id = sellerQuery.recordset[0].seller_id;

    // Insert product
    const productResult = await pool.request()
      .input("seller_id", sql.Int, seller_id)
      .input("name", sql.NVarChar, name)
      .input("description", sql.NVarChar, description || null)
      .input("price", sql.Decimal(10, 2), price)
      .input("category_id", sql.Int, category_id || null)
      .input("quantity", sql.Int, quantity)
      .input("is_rentable", sql.Bit, is_rentable || 0)
      .input("is_biddable", sql.Bit, is_biddable || 0)
      .query(`
        INSERT INTO Products (seller_id, name, description, price, category_id, quantity, is_rentable, is_biddable, created_at)
        OUTPUT INSERTED.product_id
        VALUES (@seller_id, @name, @description, @price, @category_id, @quantity, @is_rentable, @is_biddable, GETDATE())
      `);

    const product_id = productResult.recordset[0].product_id;

    // Save return policy if rentable
    if (is_rentable && daily_late_fee && damage_fee) {
      await pool.request()
        .input("product_id", sql.Int, product_id)
        .input("daily_late_fee", sql.Decimal(10, 2), daily_late_fee)
        .input("damage_fee", sql.Decimal(10, 2), damage_fee)
        .query(`
          INSERT INTO ReturnPolicies (product_id, daily_late_fee, damage_fee, created_at)
          VALUES (@product_id, @daily_late_fee, @damage_fee, GETDATE())
        `);
    }

    // Upload images
    for (const file of images) {
      const cloudinaryURL = file.path;

      await pool.request()
        .input("product_id", sql.Int, product_id)
        .input("image_url", sql.VarChar, cloudinaryURL)
        .query(`
          INSERT INTO ProductImages (product_id, image_url)
          VALUES (@product_id, @image_url)
        `);
    }

    res.status(201).json({ message: "Product created successfully!", product_id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create product.", error: err.message });
  }
});

export default router;

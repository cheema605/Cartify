import express from "express";
import multer from "multer";
import { sql, poolPromise } from "../../db/sql.js";

const router = express.Router();

// Setup multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.array("images", 10), async (req, res) => {
  const { user_id, name, description, price, quantity, category_id } = req.body;
  const images = req.files;

  if (!user_id || !name || !price || !quantity)
    return res.status(400).json({ message: "Required fields missing." });

  try {
    const pool = await poolPromise;

    // Check if the seller exists
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
      .query(`
        INSERT INTO Products (seller_id, name, description, price, category_id, quantity, created_at)
        OUTPUT INSERTED.product_id
        VALUES (@seller_id, @name, @description, @price, @category_id, @quantity, GETDATE())
      `);

    const product_id = productResult.recordset[0].product_id;

    // Insert images (loop over each buffer)
    for (const file of images) {
      await pool.request()
        .input("product_id", sql.Int, product_id)
        .input("image_data", sql.VarBinary(sql.MAX), file.buffer)
        .query(`
          INSERT INTO ProductImages (product_id, image_data)
          VALUES (@product_id, @image_data)
        `);
    }

    res.status(201).json({ message: "Product (and images) created successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create product.", error: err.message });
  }
});

export default router;

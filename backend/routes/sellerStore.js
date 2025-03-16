// backend/routes/sellerStore.js
import express from "express";
import { sql, poolPromise } from "../db/sql.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, store_name, store_description } = req.body;

  if (!user_id || !store_name)
    return res.status(400).json({ message: "User ID and store name required." });

  try {
    const pool = await poolPromise;

    // Check if store exists
    const check = await pool.request()
      .input("user_id", sql.Int, user_id)
      .query("SELECT * FROM SellerStores WHERE user_id = @user_id");

    if (check.recordset.length > 0)
      return res.status(400).json({ message: "Store already exists for this user." });

    // Insert store
    await pool.request()
      .input("user_id", sql.Int, user_id)
      .input("store_name", sql.VarChar, store_name)
      .input("store_description", sql.VarChar, store_description || null)
      .query("INSERT INTO SellerStores (user_id, store_name, store_description) VALUES (@user_id, @store_name, @store_description)");

    res.status(201).json({ message: "Store created successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create store.", error: err.message });
  }
});

export default router;

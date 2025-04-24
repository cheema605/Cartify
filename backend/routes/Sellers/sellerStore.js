// backend/routes/sellerStore.js
import express from "express";
import { sql, poolPromise } from "../../db/sql.js";

const router = express.Router();

/*
  Route: POST /api/sellerStore
  Purpose: Creates a new seller store for a given user.

  Expected JSON Body:
    - user_id:           (Int) ID of the user creating the store (required)
    - store_name:        (String) Name of the store (required)
    - store_description: (String, optional) Short bio or description of the store

  Logic:
    - Checks if a store already exists for the given user_id.
    - If not, inserts a new store record into the 'Sellers' table with current timestamp.
    - Returns an appropriate success or error message.
*/


router.post("/", async (req, res) => {
  const { user_id, store_name, store_description } = req.body;

  if (!user_id || !store_name)
    return res.status(400).json({ message: "User ID and store name required." });

  try {
    const pool = await poolPromise;

    // Check if store exists
    const check = await pool.request()
      .input("user_id", sql.Int, user_id)
      .query("SELECT * FROM Sellers WHERE user_id = @user_id");

    if (check.recordset.length > 0)
      return res.status(400).json({ message: "Store already exists for this user." });

    // Insert store
    await pool.request()
      .input("user_id", sql.Int, user_id)
      .input("shop_name", sql.VarChar, store_name || "Default Store") 
      .input("bio", sql.VarChar, store_description || null)
      .query("INSERT INTO Sellers (user_id, shop_name, bio, activated_at) VALUES (@user_id, @shop_name, @bio, GETDATE())");

    res.status(201).json({ message: "Store created successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create store.", error: err.message });
  }
});

export default router;

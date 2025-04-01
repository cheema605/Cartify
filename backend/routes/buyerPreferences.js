import express from "express";
import { sql, poolPromise } from "../db/sql.js";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("✅ buyerPreferences.js route was called!");

  const { user_id, category_id } = req.body;

  if (!user_id || !category_id) {
    return res.status(400).json({ message: "User ID and Category ID are required." });
  }

  try {
    const pool = await poolPromise;

    // Check if category exists in preferences
    const prefCheck = await pool.request()
      .input("user_id", sql.Int, user_id)
      .input("category_id", sql.Int, category_id)
      .query("SELECT * FROM BuyerPreferences WHERE user_id = @user_id AND category_id = @category_id");

    if (prefCheck.recordset.length > 0) {
      // Update last purchased timestamp
      await pool.request()
        .input("user_id", sql.Int, user_id)
        .input("category_id", sql.Int, category_id)
        .query("UPDATE BuyerPreferences SET last_purchased = GETDATE() WHERE user_id = @user_id AND category_id = @category_id");
    } else {
      // Ensure max 10 preferences, remove oldest if needed
      const prefCount = await pool.request()
        .input("user_id", sql.Int, user_id)
        .query("SELECT COUNT(*) AS count FROM BuyerPreferences WHERE user_id = @user_id");

      if (prefCount.recordset[0].count >= 10) {
        await pool.request()
          .input("user_id", sql.Int, user_id)
          .query(`
            DELETE FROM BuyerPreferences 
            WHERE category_id = (
              SELECT TOP 1 category_id FROM BuyerPreferences 
              WHERE user_id = @user_id ORDER BY last_purchased ASC
            )
          `);
      }

      // Insert new preference
      await pool.request()
        .input("user_id", sql.Int, user_id)
        .input("category_id", sql.Int, category_id)
        .query("INSERT INTO BuyerPreferences (user_id, category_id, last_purchased) VALUES (@user_id, @category_id, GETDATE())");
    }

    res.json({ message: "Buyer preference recorded!" });

  } catch (err) {
    console.error("❌ Error in buyerPreferences.js:", err);
    res.status(500).json({ message: "Error updating preferences.", error: err.message });
  }
});

export default router;

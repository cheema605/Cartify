// backend/routes/buyerPreferences.js
import express from "express";
import { sql, poolPromise } from "../db/sql.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, preferences } = req.body;

  if (!user_id || !preferences)
    return res.status(400).json({ message: "User ID and preferences required." });

  try {
    const pool = await poolPromise;

    // Check if preferences exist
    const check = await pool.request()
      .input("user_id", sql.Int, user_id)
      .query("SELECT * FROM BuyerPreferences WHERE user_id = @user_id");

    if (check.recordset.length > 0) {
      // Update preferences
      await pool.request()
        .input("preferences", sql.VarChar, preferences)
        .input("user_id", sql.Int, user_id)
        .query("UPDATE BuyerPreferences SET preferences = @preferences, updated_at = GETDATE() WHERE user_id = @user_id");

      res.json({ message: "Preferences updated!" });
    } else {
      // Insert preferences
      await pool.request()
        .input("user_id", sql.Int, user_id)
        .input("preferences", sql.VarChar, preferences)
        .query("INSERT INTO BuyerPreferences (user_id, preferences) VALUES (@user_id, @preferences)");

      res.json({ message: "Preferences set!" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to set preferences.", error: err.message });
  }
});

export default router;

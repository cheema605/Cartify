// backend/routes/login.js
import express from "express";
import { sql, poolPromise } from "../db/sql.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required." });

  try {
    const pool = await poolPromise;

    // Fetch user
    const userCheck = await pool.request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Users WHERE Email = @email");

    if (userCheck.recordset.length === 0)
      return res.status(400).json({ message: "Invalid email or password." });

    const user = userCheck.recordset[0];

    console.log("Fetched user:", user); // ✅ Debug line (optional)

    // Check password (use correct column name!)
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid email or password." });

    // Fetch buyer preferences
    const prefs = await pool.request()
      .input("user_id", sql.Int, user.id)
      .query("SELECT * FROM BuyerPreferences WHERE user_id = @user_id");

    // Fetch seller store
    const store = await pool.request()
      .input("user_id", sql.Int, user.id)
      .query("SELECT * FROM SellerStores WHERE user_id = @user_id");

    res.json({
      message: "Login successful.",
      user: { id: user.id, username: user.Username, email: user.Email },
      buyerPreferences: prefs.recordset[0] || null,
      sellerStore: store.recordset[0] || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
});

export default router;

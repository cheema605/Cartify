// backend/routes/signup.js
import express from "express";
import { sql, poolPromise } from "../db/sql.js"; // Correct import for poolPromise
import bcrypt from "bcrypt"; // Optional, for password hashing

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const pool = await poolPromise; // ✅ Use poolPromise to get the pool

    // Check if user already exists
    const check = await pool.request()
      .input("email", sql.VarChar, email)
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM Users WHERE Email = @email OR Username = @username");

    if (check.recordset.length > 0) {
      return res.status(400).json({ message: "Email or Username already exists." });
    }

    // ✅ Optional: Hash password for security (uncomment when ready)
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user (use `password` directly now, but use `hashedPassword` when ready)
    await pool.request()
      .input("username", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, password) // Change to hashedPassword when using bcrypt
      .query("INSERT INTO Users (Username, Email, Password) VALUES (@username, @email, @password)");

    return res.status(201).json({ message: "Account created successfully!" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create user.", error: err.message });
  }
});

// ✅ Default export (correct way)
export default router;

import express from "express";
import { sql, poolPromise } from "../db/sql.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, email, password, phone} = req.body;

  // Basic validation
  if (!username || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const pool = await poolPromise;

    // Check if user already exists

    const result = await pool.request().query("SELECT DB_NAME() AS CurrentDB");
console.log("✅ Currently connected to DB:", result.recordset[0].CurrentDB);
    const existingUser = await pool.request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Users WHERE Email = @email");

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ message: "Email or Username already exists." });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await pool.request()
      .input("full_name", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashedPassword)
      .input("phone", sql.VarChar, phone)
      .query("INSERT INTO Users (full_name, email, password_hash, phone, created_at) VALUES (@full_name, @email, @password, @phone, GETDATE())");



    res.status(201).json({ message: "Account created successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user.", error: err.message });
  }
});

export default router;

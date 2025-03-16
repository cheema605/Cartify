import express from "express";
import { sql, poolPromise } from "../db/sql.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const pool = await poolPromise;

    // Check if user already exists
    const existingUser = await pool.request()
      .input("email", sql.VarChar, email)
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM Users WHERE Email = @email OR Username = @username");

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ message: "Email or Username already exists." });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await pool.request()
      .input("username", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashedPassword)
      .query("INSERT INTO Users (Username, Email, Password) VALUES (@username, @email, @password)");

    res.status(201).json({ message: "Account created successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user.", error: err.message });
  }
});

export default router;

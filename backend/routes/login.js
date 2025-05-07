// backend/routes/login.js
import express from "express";
import { sql, poolPromise } from "../db/sql.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";  // Import jwt

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";  // Secret key for signing the JWT

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
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) return res.status(400).json({ message: "Invalid email or password." });

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        username: user.full_name,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: "Login successful.",
      token,  // Send the JWT token in the response
      user: { id: user.id, username: user.Username, email: user.Email },
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
});

export default router;

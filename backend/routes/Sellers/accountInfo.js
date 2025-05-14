import express from "express";
import { sql, poolPromise } from "../../db/sql.js";
import authenticateJWT from "../../middleware/auth.js";

const router = express.Router();

/**
 * Route: GET /api/seller/account-info
 * Purpose: Fetches account information for the authenticated seller
 * 
 * Authentication: JWT Token required in Authorization header
 * 
 * Returns:
 * - Seller's profile information including user details and shop information
 */
router.get("/account-info", authenticateJWT, async (req, res) => {
  const user_id = req.user; // Get user_id from JWT token

  try {
    const pool = await poolPromise;

    // Fetch user and seller information with a JOIN
    const result = await pool.request()
      .input("user_id", sql.Int, user_id)
      .query(`
        SELECT 
          u.full_name as name, 
          u.email, 
          u.phone, 
          s.shop_name, 
          s.bio, 
          s.activated_at
        FROM 
          Users u
        LEFT JOIN 
          Sellers s ON u.user_id = s.user_id
        WHERE 
          u.user_id = @user_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const userData = result.recordset[0];
    
    // Construct address from bio if available (as a placeholder)
    const address = userData.bio || "";

    // Return formatted user data
    res.status(200).json({
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      address: address,
      shop_name: userData.shop_name || "",
      seller_since: userData.activated_at || null
    });

  } catch (err) {
    console.error("Error fetching account info:", err);
    res.status(500).json({ message: "Failed to fetch account information.", error: err.message });
  }
});

/**
 * Route: POST /api/seller/update-account
 * Purpose: Updates account information for the authenticated seller
 * 
 * Authentication: JWT Token required in Authorization header
 * 
 * Request Body:
 * - name: (String) Updated full name
 * - phone: (String) Updated phone number
 * - address: (String) Updated address (will be stored in bio field)
 * 
 * Returns:
 * - Success message or error
 */
router.post("/update-account", authenticateJWT, async (req, res) => {
  const user_id = req.user; // Get user_id from JWT token
  const { name, phone, address } = req.body;

  try {
    const pool = await poolPromise;

    // Update user information
    await pool.request()
      .input("user_id", sql.Int, user_id)
      .input("full_name", sql.VarChar, name)
      .input("phone", sql.VarChar, phone)
      .query(`
        UPDATE Users 
        SET 
          full_name = @full_name,
          phone = @phone
        WHERE 
          user_id = @user_id
      `);

    // Check if seller record exists
    const sellerCheck = await pool.request()
      .input("user_id", sql.Int, user_id)
      .query("SELECT seller_id FROM Sellers WHERE user_id = @user_id");

    if (sellerCheck.recordset.length > 0) {
      // Update seller bio with address
      await pool.request()
        .input("user_id", sql.Int, user_id)
        .input("bio", sql.VarChar, address)
        .query(`
          UPDATE Sellers 
          SET 
            bio = @bio
          WHERE 
            user_id = @user_id
        `);
    }

    res.status(200).json({ message: "Account updated successfully." });

  } catch (err) {
    console.error("Error updating account:", err);
    res.status(500).json({ message: "Failed to update account information.", error: err.message });
  }
});

export default router; 
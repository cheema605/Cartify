// backend/routes/sellerStore.js
import express from "express";
import { sql, poolPromise } from "../../db/sql.js";
import authenticateJWT from "../../middleware/auth.js";

const router = express.Router();

/*
  Route: POST /api/sellerStore
  Purpose: Creates a new seller store for a given user.

  Expected JSON Body:
    - store_name:        (String) Name of the store (required)
    - store_description: (String, optional) Short bio or description of the store

  Logic:
    - Checks if a store already exists for the given user_id.
    - If not, inserts a new store record into the 'Sellers' table with current timestamp.
    - Returns an appropriate success or error message.
*/

router.post("/", authenticateJWT, async (req, res) => {
  const { store_name, store_description } = req.body;
  const user_id = req.user; // Get user_id from JWT token

  if (!store_name)
    return res.status(400).json({ message: "Store name required." });

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

/*
  Route: GET /api/sellerStore/check/:user_id
  Purpose: Check if a user has a store.

  Expected URL Parameter:
    - user_id: (Int) ID of the user to check

  Logic:
    - Checks if a store exists for the given user_id.
    - Returns appropriate status code and message.
*/

router.get("/check/:user_id", authenticateJWT, async (req, res) => {
  const { user_id } = req.params;
  const token_user_id = req.user; // Get user_id from JWT token

  // Verify that the requesting user is checking their own store
  if (parseInt(user_id) !== token_user_id) {
    return res.status(403).json({ message: "Unauthorized to check this user's store status." });
  }

  try {
    const pool = await poolPromise;

    const check = await pool.request()
      .input("user_id", sql.Int, user_id)
      .query("SELECT * FROM Sellers WHERE user_id = @user_id");

    if (check.recordset.length > 0) {
      res.status(200).json({ message: "Store exists.", store: check.recordset[0] });
    } else {
      res.status(404).json({ message: "No store found for this user." });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to check store status.", error: err.message });
  }
});

// GET /api/seller/products?user_id=... - fetch all products for a seller
router.get('/products', authenticateJWT, async (req, res) => {
  const user_id = parseInt(req.query.user_id);
  if (!user_id) {
    return res.status(400).json({ message: 'user_id is required as a query parameter.' });
  }
  try {
    const pool = await poolPromise;
    // Get seller_id for this user
    const sellerResult = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query('SELECT seller_id FROM Sellers WHERE user_id = @user_id');
    if (sellerResult.recordset.length === 0) {
      return res.status(404).json({ message: 'No seller found for this user.' });
    }
    const seller_id = sellerResult.recordset[0].seller_id;
    // Get all products for this seller
    const productsResult = await pool.request()
      .input('seller_id', sql.Int, seller_id)
      .query(`
        SELECT p.*, c.category_name
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.category_id
        WHERE p.seller_id = @seller_id
        ORDER BY p.created_at DESC
      `);
    res.json({ products: productsResult.recordset });
  } catch (err) {
    console.error('Error fetching seller products:', err);
    res.status(500).json({ message: 'Failed to fetch products.', error: err.message });
  }
});

// POST /api/sellerStore/products - fetch all products for a seller (user_id in body)
router.post('/products', authenticateJWT, async (req, res) => {
  const user_id = parseInt(req.body.user_id);
  if (!user_id) {
    return res.status(400).json({ message: 'user_id is required in the request body.' });
  }
  try {
    const pool = await poolPromise;
    // Get seller_id for this user
    const sellerResult = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query('SELECT seller_id FROM Sellers WHERE user_id = @user_id');
    if (sellerResult.recordset.length === 0) {
      return res.status(404).json({ message: 'No seller found for this user.' });
    }
    const seller_id = sellerResult.recordset[0].seller_id;
    // Get all products for this seller
    const productsResult = await pool.request()
      .input('seller_id', sql.Int, seller_id)
      .query(`
        SELECT p.*, c.category_name
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.category_id
        WHERE p.seller_id = @seller_id
        ORDER BY p.created_at DESC
      `);
    res.json({ products: productsResult.recordset });
  } catch (err) {
    console.error('Error fetching seller products (POST):', err);
    res.status(500).json({ message: 'Failed to fetch products.', error: err.message });
  }
});

// Get all orders for a seller
router.post('/orders', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ message: 'user_id is required' });
  }
  try {
    const pool = await poolPromise;
    // Get seller_id from user_id
    const sellerResult = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query('SELECT seller_id FROM Sellers WHERE user_id = @user_id');
    if (sellerResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Seller not found for this user_id' });
    }
    const seller_id = sellerResult.recordset[0].seller_id;
    // Get all orders that include at least one product from this seller
    const ordersResult = await pool.request()
      .input('seller_id', sql.Int, seller_id)
      .query(`
        SELECT DISTINCT o.order_id, o.buyer_id, u.full_name AS buyer_name, o.total_price, o.status, o.order_date
        FROM Orders o
        JOIN Order_Items oi ON o.order_id = oi.order_id
        JOIN Products p ON oi.product_id = p.product_id
        JOIN Users u ON o.buyer_id = u.user_id
        WHERE p.seller_id = @seller_id
        ORDER BY o.order_date DESC
      `);
    res.json({ orders: ordersResult.recordset });
  } catch (err) {
    console.error('Error fetching seller orders:', err);
    res.status(500).json({ message: 'Failed to fetch seller orders', error: err.message });
  }
});

export default router;

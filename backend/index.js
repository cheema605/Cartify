import 'dotenv/config'; // ✅ Load env vars at the top
import express from "express";
import cors from "cors";
import purchaseRoute from './routes/purchase.js';
import signupRoute from "./routes/signup.js";
import buyerPrefRoute from './routes/BuyerPreferences.js';
import sellerStoreRoute from './routes/Sellers/sellerStore.js';
import createProduct from './routes/Sellers/createProduct.js';
import editProduct from './routes/Sellers/editProduct.js';
import wishlist from './routes/Buyers/WishList.js';
import Discount from './routes/Sellers/Discount.js';
import Order from './routes/Buyers/Order.js';
import loginRoute from './routes/login.js';
import preferences from './routes/Buyers/Preferences.js';
import shoppingCart from './routes/Buyers/ShoppingCart.js';
import uploadRoute from './routes/upload.js';
import exploreRoute from './routes/explore/explore.js';
import reviewRoute from './routes/Buyers/reviews.js';
import chatbot from './routes/chatbot/chatbot.js';
import products from './routes/Buyers/products.js';
import search from './routes/Buyers/search.js';
import categories from './routes/Buyers/categories.js';  // Added import for categories route

import { poolPromise} from "./db/sql.js"; // ✅ Import both

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => res.json({ message: "API is running 🚀" }));

app.get("/api/db-test", async (req, res) => {
  try {
    const pool = await poolPromise;
    // Test query to check if tables exist
    const result = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
    `);
    res.json({
      message: "Database connection successful",
      tables: result.recordset
    });
  } catch (err) {
    console.error("❌ Database test error:", err);
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
});

app.post("/api/test", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT 1 AS test");
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Query error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.use('/api/purchase', purchaseRoute);
app.use("/api/signup", signupRoute);
app.use('/api/buyerpreferences', buyerPrefRoute);
app.use('/api/seller/create-store', sellerStoreRoute);
app.use('/api/seller/create-product', createProduct); 
app.use('/api/seller/edit-product', editProduct); 
app.use('/api/wishlist', wishlist);
app.use('/api/discount', Discount);
app.use('/api/order', Order);
app.use('/api/shoppping-cart', shoppingCart);
app.use('/api/preferences', preferences);
app.use('/api/login', loginRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/explore', exploreRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/chatbot', chatbot);
app.use('/api/products', products);
app.use('/api/categories', categories);  // Added route registration
app.use('/api/search', search);


const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`Route: ${r.route.stack[0].method.toUpperCase()} ${r.route.path}`);
  } else if (r.name === 'router') {
    r.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(`Route: ${handler.route.stack[0].method.toUpperCase()} ${r.regexp.source + handler.route.path}`);
      }
    });
  }
});

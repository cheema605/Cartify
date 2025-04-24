import 'dotenv/config'; // ✅ Load env vars at the top
import express from "express";
import cors from "cors";
import purchaseRoute from './routes/purchase.js';
import signupRoute from "./routes/signup.js";
import buyerPrefRoute from './routes/BuyerPreferences.js';
import sellerStoreRoute from './routes/Sellers/sellerStore.js';
import createProduct from './routes/Sellers/createProduct.js';
import loginRoute from './routes/login.js';




import { poolPromise, connectToDatabase } from "./db/sql.js"; // ✅ Import both

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => res.json({ message: "API is running 🚀" }));

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
app.use('/api/login', loginRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectToDatabase(); // ✅ Connect DB when server starts (optional)
});



app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`Route: ${r.route.stack[0].method.toUpperCase()} ${r.route.path}`);
  }
});

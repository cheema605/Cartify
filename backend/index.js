import 'dotenv/config'; // ✅ Load env vars at the top
import express from "express";
import cors from "cors";
import signupRoute from "./routes/signup.js";
import buyerPrefRoute from './routes/buyerPreferences.js';
import sellerStoreRoute from './routes/sellerStore.js';
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

app.use("/api/signup", signupRoute);
app.use('/api/buyer/preferences', buyerPrefRoute);
app.use('/api/seller/create-store', sellerStoreRoute);
app.use('/api/login', loginRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectToDatabase(); // ✅ Connect DB when server starts (optional)
});

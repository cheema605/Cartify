import express from 'express'
import { sql, poolPromise } from '../../db/sql.js' // update import
import authenticateJWT from '../../middleware/auth.js'

const router = express.Router()


app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;  // Get the message from frontend
    console.log("User Message:", userMessage);

    // Respond with a simple "Hello" for now
    res.json({ response: "Hello" });
  } catch (err) {
    console.error("❌ Chatbot error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
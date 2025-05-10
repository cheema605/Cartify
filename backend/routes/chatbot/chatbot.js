import express from 'express';
import { spawn } from 'child_process';
import authenticateJWT from '../../middleware/auth.js';

const router = express.Router();

const responses = {
  greeting: [
    "Hi there! How can I assist you today?",
    "Hello! Need help with something?",
    "Hey! What can I do for you?",
    "Welcome! How may I help you today?"
  ],
  goodbye: [
    "Goodbye! Have a great day!",
    "See you later! If you need anything else, just ask.",
    "Thanks for visiting! Come back anytime.",
    "Take care! Let me know if you need further help."
  ],
  thanks: [
    "You're welcome!",
    "Glad I could help!",
    "No problem at all!",
    "Anytime! Let me know if you need more help."
  ],
  return_policy: [
    "You can return items within 30 days of delivery.",
    "Our return policy allows returns within 30 days of purchase.",
    "Returns are accepted for unused items within 30 days.",
    "I can help with returns. Do you have your order ID?"
  ],
  refund_policy: [
    "Refunds are processed within 5–7 business days after we receive the return.",
    "Yes, we offer refunds! Just start a return and we’ll handle the rest.",
    "Refunds are available on most items within 30 days.",
    "Let me help with the refund. Can you provide the order details?"
  ],
  cancel_order: [
    "Sure! I can help cancel your order. What's the order ID?",
    "To cancel your order, I’ll need your order number.",
    "Cancellations are possible before shipping. Let me know which order.",
    "I'm on it! Please provide the order you want to cancel."
  ],
  track_order: [
    "Please provide your order ID so I can check its status.",
    "Sure! I can help you track it. Do you have a tracking number?",
    "Let me find that for you. Can you share your order ID?",
    "Just send your order number and I’ll look it up."
  ],
  change_order: [
    "Sure! What changes do you want to make to your order?",
    "Orders can be updated within 24 hours. What's the change?",
    "To modify your order, I’ll need your order ID.",
    "I can help update your order. What needs to be changed?"
  ],
  account_help: [
    "Having trouble logging in? I can help!",
    "Forgot your password? You can reset it via 'Forgot Password' on login.",
    "I’ll help you access your account. What seems to be the issue?",
    "Need help with your profile? Just let me know."
  ],
  payment_methods: [
    "We accept credit cards, PayPal, and other major payment methods.",
    "Yes! You can use Visa, MasterCard, PayPal, and more.",
    "We support most popular payment methods.",
    "Looking for a specific method? I can check that for you."
  ],
  site_navigation: [
    "You can find FAQs and Contact page in the site footer.",
    "Need help? The Help Center is in the Support section.",
    "Try the top menu or footer for quick links to key pages.",
    "Looking for something? I can guide you."
  ],
  unknown: [
    "I'm not sure I understood that. Could you rephrase?",
    "Hmm, I’m still learning. Try asking differently.",
    "Sorry, I don’t have an answer for that yet.",
    "I didn’t catch that. Want to try again?"
  ]
};

router.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("User Message:", userMessage);

    const pythonProcess = spawn('python', ['./routes/chatbot/prediction.py', userMessage]);

    let dataString = '';
    let errorString = '';
    let responseSent = false;

    const timeout = setTimeout(() => {
      if (!responseSent) {
        pythonProcess.kill();
        console.error('Python script timed out');
        responseSent = true;
        return res.status(500).json({ error: 'Python script timed out' });
      }
    }, 65000); // 15 sec

    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
      console.error('Python stderr:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      clearTimeout(timeout);
      if (responseSent) return;

      if (code !== 0) {
        responseSent = true;
        console.error(`Python script exited with code ${code}`);
        return res.status(500).json({ error: 'Python script error', details: errorString });
      }

      try {
        const response = JSON.parse(dataString);
        const intent = response.intent || 'unknown';
        console.log('Predicted Intent:', intent);

        const intentResponses = responses[intent] || responses.unknown;
        const finalReply = intentResponses[Math.floor(Math.random() * intentResponses.length)];

        responseSent = true;
        return res.json({ intent, reply: finalReply });
      } catch (e) {
        responseSent = true;
        console.error('Error parsing JSON from Python script:', e);
        return res.status(500).json({ error: 'Invalid JSON from Python script' });
      }
    });
  } catch (err) {
    console.error("❌ Chatbot error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

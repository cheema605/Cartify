import express from 'express';
import { spawn } from 'child_process'; // Import spawn instead of PythonShell
import authenticateJWT from '../../middleware/auth.js';

const router = express.Router();

router.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message; // Get the message from frontend
    console.log("User Message:", userMessage);

    // Set up the options to call the Python script
    const options = {
      mode: 'text',
      pythonPath: 'python', // Or specify the path to your Python executable
      scriptPath: './routes/chatbot', // Path to where your Python script is located
      args: [userMessage], // Send the message as an argument to the Python script
      timeout: 10000, // 10 seconds timeout to prevent hanging
    };

    console.log("Running prediction.py with options:", options);

    // Run the Python script using spawn
    const pythonProcess = spawn('python', ['./routes/chatbot/prediction.py', userMessage]);

    let dataString = '';
    let errorString = '';
    let responseSent = false;

    // Set a timeout to kill the process if it hangs
    const timeout = setTimeout(() => {
      if (!responseSent) {
        pythonProcess.kill();
        console.error('Python script timed out');
        responseSent = true;
        return res.status(500).json({ error: 'Python script timed out' });
      }
    }, 15000); // 15 seconds

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
        console.log('Predicted Intent:', response.intent);
        if (response.error || !response.intent) {
          responseSent = true;
          return res.status(200).json({ intent: 'unknown' });
        }
        responseSent = true;
        return res.json({ intent: response.intent });
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

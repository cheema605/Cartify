import express from 'express';
import upload from '../db/multer.js'; // make sure multer config is also using ES modules

const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try {
    res.status(200).json({ url: req.file.path }); // This will be the Cloudinary URL
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

export default router;

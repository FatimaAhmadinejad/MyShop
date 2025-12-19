import express from 'express';
import axios from 'axios';

const router = express.Router();

// Route برای گرفتن توصیه‌گر
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const response = await axios.get(`https://recommender-gyqm.onrender.com/recommend/${productId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({ message: "Could not fetch recommendations" });
  }
});

export default router;
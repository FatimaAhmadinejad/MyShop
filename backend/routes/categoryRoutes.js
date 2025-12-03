import express from 'express';
import Product from '../model/productModel.js';

const router = express.Router();

// گرفتن دسته‌بندی‌های یکتا
router.get('/', async (req, res) => {
  try {
    const categories = await Product.find().distinct('category'); // فقط دسته‌بندی‌ها
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;

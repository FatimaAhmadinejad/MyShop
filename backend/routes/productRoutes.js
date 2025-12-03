import express from 'express';
import { 
    createProduct,
     getProducts,
     getProductsById,
     UpdateProduct,
     DeleteProduct,
     createProductReview,
     getTopProducts,
     getCategories
     } from '../contorllers/productsContorller.js';
import {protect,admin} from '../middleware/authMiddleware.js'
const router = express.Router();
router.get('/categories', getCategories);
router.get('/top',getTopProducts);
router.route('/').get(getProducts).post(protect,admin,createProduct)
router.route('/:id').get(getProductsById).put(protect,admin,UpdateProduct).delete(protect,admin,DeleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);

export default router;
import express from 'express';
import {
    addOrderItems,
    getMyOrder,
    getOrderByID,
    UpdateOrderToPaid,
    UpdateOrderToDelivered,
    getOrders
} from '../contorllers/orderContorller.js'
import { protect,admin } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').post(protect,addOrderItems).get(protect,admin,getOrders);
router.route('/mine').get(protect,getMyOrder);
router.route('/:id').get(protect,getOrderByID);
router.route('/:id/pay').put(protect,UpdateOrderToPaid);
router.route('/:id/deliver').put(protect,admin,UpdateOrderToDelivered);
export default router;
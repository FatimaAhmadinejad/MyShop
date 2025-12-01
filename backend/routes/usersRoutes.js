import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUser,
    getUserByID,
    deleteUser,
    updateUser
} from '../contorllers/userContorller.js'
import { protect,admin } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').post(registerUser).get(protect,admin,getUser);
router.post('/logout',logoutUser)
router.post('/auth',authUser)
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);
router.route('/:id').delete(protect,admin,deleteUser).get(protect,admin,getUserByID).put(protect,admin,updateUser);
export default router;
import jwt from 'jsonwebtoken';
import asyncHandler from './asynchandler.js';
import User from '../model/userModel.js';

// Product routes
const protect = asyncHandler(async(req,res,next) => {
    let token;
    // Read the jwt from the cookie
    token = req.cookies.jwt;
    console.log(token);
    if(token){
        try {
        const decoded = jwt.verify(token, process.env.TEST);
       req.user = await User.findById(decoded.userId).select('-password');
       next();
         } catch (TOKENERROR) {
            console.log(TOKENERROR);
            res.status(401);
             throw new Error('Not authorized, token failed')
         }
    }else{
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Admin middleware
const admin = (req,res,next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }else {
        res.status(401);
        throw new Error('Not authorized,no token as admin');

    }

}
export {protect,admin}
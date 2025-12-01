import asyncHandler from '../middleware/asynchandler.js';
import Order from '../model/orderModel.js';

// @desc    Create new Order
//@route    POST /api/orders
//@access   Private
const addOrderItems = asyncHandler(async(req,res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body
    if(orderItems && orderItems.length === 0){
        res.status(400);
        throw new Error('No order items');
    }else{
        const order = new Order({
            orderItems:orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined
            })),
            user : req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    }
});
// @desc    Get logged in user orders
//@route    GET /api/orders/myorders
//@access   Private
const getMyOrder = asyncHandler(async(req,res) => {
    const orders = await Order.find({user: req.user._id});
    res.status(200).json(orders);
});
// @desc    Get order by ID
//@route    GET /api/orders/:id
//@access   Private
const getOrderByID = asyncHandler(async(req,res) => {
    const order = await Order.findById(req.params.id).populate('user','name email');

    if(order) {
        res.status(200).json(order);
    }else {
        res.status(404);
        throw new Error('Order not found');
    }
}); 
// @desc    Update order to paid
//@route    PUT /api/orders/:id/pay
//@access   Private
const UpdateOrderToPaid = asyncHandler(async(req,res) => {
    const order = await Order.findById(req.params.id);

    if(order){
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updateOrder = await order.save();

        res.status(200).json(updateOrder);
    }else {
        res.status(404);
        throw new Error('Order not found');
    }
});
// @desc    Update order to delivered
//@route    PUT /api/orders/:id/delivered
//@access   Private/Admin
const UpdateOrderToDelivered = asyncHandler(async(req,res) => {
    const order = await Order.findById(req.params.id);

    if(order){
        order.isDelivered = true;
        order.deliveredAt = new Date().getDay();

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    }else {
        res.status(404);
        throw new Error('Order not Found')
    }
});
// @desc    Get all orders 
//@route    GET /api/orders/:id/pay
//@access   Private/Admin
const getOrders = asyncHandler(async(req,res) => {
    const orders = await Order.find({}).populate('user','id name');
    res.status(200).json(orders);
});
export {
    addOrderItems,
    getMyOrder,
    getOrderByID,
    UpdateOrderToPaid,
    UpdateOrderToDelivered,
    getOrders
}
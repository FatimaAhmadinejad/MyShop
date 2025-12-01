import { createSlice } from "@reduxjs/toolkit";
import {updateCart} from "../utils/cartUtils.js"
 const initialState = localStorage.getItem('cart') ? JSON.parse(
 localStorage.getItem('cart')) : {cartItems: [],shippingAddress:{},paymentMethod:'PayPal'};

const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
}

const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
      addToCart:(state,action) => {
            const item = action.payload;

           const existItems = state.cartItems.find((x) => x._id === item._id);

         if(existItems){
                 state.cartItems = state.cartItems.map((x) => x._id === existItems._id ? item:x);
             }else{
                 state.cartItems =[...state.cartItems,item];
                
            }
            return updateCart(state,item);
        },
         removeFromCart: (state,action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
             return updateCart(state);
         },
         saveShippingAddress: (state,action) => {
            state.shippingAddress = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
         },
         savePaymentMethod: (state,action) => {
            state.paymentMethod = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
         },
         clearCartItems: (state,action) => {
            state.cartItems = [];
            localStorage.setItem('cart', JSON.stringify(state));
         }
    },
});

export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
clearCartItems} = cartSlice.actions;

export default cartSlice.reducer;
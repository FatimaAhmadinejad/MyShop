import { apiSlice } from './apiSlice.js';
import { ORDERS_URL, PAYPAL_URL } from '../constents.js';

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: { ...order },
                credentials: 'include', // ارسال کوکی‌ها
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`,
                credentials: 'include', // اگر نیاز به auth داره
            }),
            keepUnusedDataFor: 5,
        }),
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
                body: { ...details },
                credentials: 'include', // ارسال کوکی‌ها
            }),
        }),
        getPayPalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
                method: 'GET',
                credentials: 'include', // ارسال کوکی‌ها
            }),
            keepUnusedDataFor: 5,
        }),
        getMyOrder: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/mine`,
                credentials: 'include', // ارسال کوکی‌ها
            }),
            keepUnusedDataFor: 5,
        }),
        getOrders: builder.query({
            query: () => ({
                url: ORDERS_URL,
                credentials: 'include', // ارسال کوکی‌ها
            }),
            keepUnusedDataFor: 5,
        }),
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT',
                credentials: 'include', // ارسال کوکی‌ها اگر نیاز داره
            }),
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    useGetMyOrderQuery,
    useGetOrdersQuery,
    useDeliverOrderMutation,
    usePayOrderMutation,
    useGetPayPalClientIdQuery,
} = orderApiSlice;
import { apiSlice } from './apiSlice.js';
import { ORDERS_URL, PAYPAL_URL } from '../constents.js';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ایجاد سفارش جدید
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order, // مستقیم orderItems, shippingAddress, paymentMethod, etc
      }),
      invalidatesTags: ['Order'],
    }),

    // جزئیات سفارش
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Order'],
    }),

    // پرداخت سفارش
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
      invalidatesTags: ['Order'],
    }),

    // گرفتن PayPal Client ID
    getPayPalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),

    // سفارشات کاربر جاری
    getMyOrder: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      providesTags: ['Order'],
      keepUnusedDataFor: 5,
    }),

    // گرفتن همه سفارشات (Admin)
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Order'],
    }),

    // بروزرسانی سفارش به وضعیت تحویل داده شده
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
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



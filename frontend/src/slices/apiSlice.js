import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constents';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User', 'Category'],
  endpoints: (builder) => ({
    // دسته‌بندی‌ها
    getCategories: builder.query({
      query: () => '/api/categories', // مسیر backend
      transformResponse: (response) => Array.isArray(response) ? response : [], // همیشه آرایه
      providesTags: ['Category'],
    }),

    // محصولات
    getProducts: builder.query({
      query: ({ keyword = '', pageNumber = 1, category = '' }) => {
        let url = `/api/products?pageNumber=${pageNumber}`;
        if (keyword) url += `&keyword=${keyword}`;
        if (category) url += `&category=${category}`;
        return url;
      },
      providesTags: ['Product'],
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const { useGetCategoriesQuery, useGetProductsQuery } = apiSlice;

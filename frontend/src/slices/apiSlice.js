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
      query: () => '/api/categories',
      transformResponse: (response) =>
        Array.isArray(response) ? response : [],
      providesTags: ['Category'],
    }),

    // محصولات
    getProducts: builder.query({
      query: ({
        keyword = '',
        category = '',
        brand = '',
        minPrice,
        maxPrice,
        sort = '',
        pageNumber = 1,
      } = {}) => {
        const params = { pageNumber };

        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        if (brand) params.brand = brand;
        if (minPrice !== undefined) params.minPrice = minPrice;
        if (maxPrice !== undefined) params.maxPrice = maxPrice;
        if (sort) params.sort = sort;

        return {
          url: '/api/products',
          params,
        };
      },
      providesTags: ['Product'],
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetProductsQuery,
} = apiSlice;


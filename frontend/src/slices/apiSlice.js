import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// CRA
const BASE_URL = process.env.REACT_APP_API_URL + '/api'

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // ز cookie استفاده می‌کنی
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.userInfo?.token

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User', 'Category'],
  endpoints: (builder) => ({
    // دسته‌بندی‌ها
    getCategories: builder.query({
      query: () => '/products/categories',
      transformResponse: (response) =>
        Array.isArray(response) ? response : [],
      providesTags: ['Category'],
    }),

    // برندها
    getBrands: builder.query({
      query: () => '/products/brands',
      transformResponse: (response) =>
        Array.isArray(response) ? response : [],
      providesTags: ['Product'],
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
        const params = { pageNumber }

        if (keyword) params.keyword = keyword
        if (category) params.category = category
        if (brand) params.brand = brand
        if (minPrice !== undefined) params.minPrice = minPrice
        if (maxPrice !== undefined) params.maxPrice = maxPrice
        if (sort) params.sort = sort

        return {
          url: '/products',
          params,
        }
      },
      providesTags: ['Product'],
      refetchOnMountOrArgChange: true,
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetProductsQuery,
} = apiSlice





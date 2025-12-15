import { PRODUCTS_URL,UPLOAD_URL } from "../constents";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
  query: ({
    keyword = '',
    category = '',
    brand = '',
    minPrice = '',
    maxPrice = '',
    sort = '',
    pageNumber = 1,
  } = {}) => {
    
    return {
      url: PRODUCTS_URL,
      params: {
        keyword: String(keyword),
        category: String(category),
        brand: String(brand),
        minPrice: String(minPrice),
        maxPrice: String(maxPrice),
        sort: String(sort),
        pageNumber: Number(pageNumber),
      },
    };
  },
  providesTags: ['Product'],
  keepUnusedDataFor: 5,
}), 


        getProductDetails : builder.query({
            query: (productId) => ({
                url:`${PRODUCTS_URL}/${productId}`,
            })
        }),
        createProduct: builder.mutation({
            query: () => ({
                url:`${PRODUCTS_URL}`,
                method:'POST',
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url:`${PRODUCTS_URL}/${data.productId}`,
                method: 'PUT',
                body:data,
            }),
            invalidatesTags:['Product'],
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method:'POST',
                body:data,
            }),
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method:'DELETE',
            }),
        }),
        createReviews: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags:['Product'],
        }),
        getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`,
            }),
            keepUnusedDataFor: 5,
        })
    }),
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateReviewsMutation,
    useGetTopProductsQuery,
} = productsApiSlice;
import { PRODUCTS_URL, UPLOAD_URL } from "../constents";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // --------------------
    // GET PRODUCTS
    // --------------------
    getProducts: builder.query({
      query: ({
        keyword = "",
        category = "",
        brand = "",
        minPrice = "",
        maxPrice = "",
        sort = "",
        pageNumber = 1,
      } = {}) => ({
        url: PRODUCTS_URL,
        params: {
          keyword,
          category,
          brand,
          minPrice,
          maxPrice,
          sort,
          pageNumber,
        },
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    // --------------------
    // GET PRODUCT DETAILS
    // --------------------
    getProductDetails: builder.query({
      query: (productId) => `${PRODUCTS_URL}/${productId}`,
    }),

    // --------------------
    // CREATE PRODUCT (ADMIN)
    // --------------------
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),

    // --------------------
    // UPDATE PRODUCT (ADMIN) ✅ FIXED
    // --------------------
    updateProduct: builder.mutation({
      query: ({
        productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      }) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "PUT",
        body: {
          name,
          price,
          image,
          brand,
          category,
          countInStock,
          description,
        },
      }),
      invalidatesTags: ["Product"],
    }),

    // --------------------
    // UPLOAD PRODUCT IMAGE
    // --------------------
    uploadProductImage: builder.mutation({
      query: (formData) => ({
        url: UPLOAD_URL,
        method: "POST",
        body: formData,
      }),
    }),

    // --------------------
    // DELETE PRODUCT (ADMIN)
    // --------------------
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // --------------------
    // CREATE REVIEW ✅ FIXED
    // --------------------
    createReviews: builder.mutation({
      query: ({ productId, rating, comment }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: "POST",
        body: {
          rating: Number(rating),
          comment,
        },
      }),
      invalidatesTags: ["Product"],
    }),

    // --------------------
    // TOP PRODUCTS
    // --------------------
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5,
    }),

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




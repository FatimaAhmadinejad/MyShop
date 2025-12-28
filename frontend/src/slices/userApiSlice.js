import { USERS_URL } from "../constents";
import { apiSlice } from "./apiSlice";

// helper برای اضافه کردن token به header
// ❌ دیگر استفاده نمی‌شود چون prepareHeaders در apiSlice داریم
// const authHeader = (token) => ({
//   Authorization: `Bearer ${token}`,
//   'Content-Type': 'application/json',
// });

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // login بدون نیاز به token
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
      keepUnusedDataFor: 5,
    }),

    // register بدون نیاز به token
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),

    // logout بدون نیاز به token
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),

    // profile نیاز به token دارد
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User', 'Order'],
    }),

    // گرفتن همه‌ی کاربران نیاز به token دارد
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),

    // حذف کاربر نیاز به token دارد
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
} = usersApiSlice;
 


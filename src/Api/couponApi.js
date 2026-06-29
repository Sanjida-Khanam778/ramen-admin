import { api } from "./api";

export const couponApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /admin/coupons/?status=active|disabled|expired
    getCoupons: builder.query({
      query: (status) => ({
        url: status ? `admin/coupons/?status=${status}` : `admin/coupons/`,
        method: "GET",
      }),
      providesTags: ["coupons"],
    }),

    // GET /admin/coupons/:couponId/
    getCouponById: builder.query({
      query: (couponId) => ({
        url: `admin/coupons/${couponId}/`,
        method: "GET",
      }),
      providesTags: (result, error, couponId) => [
        { type: "coupon-detail", id: couponId },
      ],
    }),

    // POST /admin/coupons/
    createCoupon: builder.mutation({
      query: (data) => ({
        url: `admin/coupons/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["coupons"],
    }),

    // PATCH /admin/coupons/:couponId/
    updateCoupon: builder.mutation({
      query: ({ couponId, ...data }) => ({
        url: `admin/coupons/${couponId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { couponId }) => [
        "coupons",
        { type: "coupon-detail", id: couponId },
      ],
    }),

    // PATCH /admin/coupons/:couponId/ — { is_active: false }
    disableCoupon: builder.mutation({
      query: (couponId) => ({
        url: `admin/coupons/${couponId}/`,
        method: "PATCH",
        body: { is_active: false },
      }),
      invalidatesTags: (result, error, couponId) => [
        "coupons",
        { type: "coupon-detail", id: couponId },
      ],
    }),

    // DELETE /admin/coupons/:couponId/
    deleteCoupon: builder.mutation({
      query: (couponId) => ({
        url: `admin/coupons/${couponId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupons"],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDisableCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
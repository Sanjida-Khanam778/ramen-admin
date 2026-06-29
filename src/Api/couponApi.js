import { api } from "./api";

export const couponApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Coupons ───────────────────────────────────────────────────────────────

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

    // ─── Settings ──────────────────────────────────────────────────────────────

    // GET /admin/settings/
    getSettings: builder.query({
      query: () => ({
        url: `admin/settings/`,
        method: "GET",
      }),
      providesTags: ["settings"],
    }),

    // POST /admin/settings/ — body: { key, value, description }
    updateSetting: builder.mutation({
      query: (data) => ({
        url: `admin/settings/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),

    // ─── Withdrawals ───────────────────────────────────────────────────────────

    // GET /admin/withdrawals/
    // params: { status, payout_method, search, ordering }
    // defaults to status=pending if no params passed
    getWithdrawals: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.status)        searchParams.set("status",        params.status);
        if (params.payout_method) searchParams.set("payout_method", params.payout_method);
        if (params.search)        searchParams.set("search",        params.search);
        if (params.ordering)      searchParams.set("ordering",      params.ordering);
        const qs = searchParams.toString();
        return {
          url: qs ? `admin/withdrawals/?${qs}` : `admin/withdrawals/`,
          method: "GET",
        };
      },
      providesTags: ["withdrawals"],
    }),

    // GET /admin/withdrawals/:requestId/
    getWithdrawalById: builder.query({
      query: (requestId) => ({
        url: `admin/withdrawals/${requestId}/`,
        method: "GET",
      }),
      providesTags: (result, error, requestId) => [
        { type: "withdrawal-detail", id: requestId },
      ],
    }),

    // PATCH /admin/withdrawals/:requestId/ → approve (status: "paid")
    approveWithdrawal: builder.mutation({
      query: (requestId) => ({
        url: `admin/withdrawals/${requestId}/`,
        method: "PATCH",
        body: { status: "paid" },
      }),
      invalidatesTags: (result, error, requestId) => [
        "withdrawals",
        { type: "withdrawal-detail", id: requestId },
      ],
    }),

    // PATCH /admin/withdrawals/:requestId/ → cancel (status: "cancelled")
    // args: { requestId, rejection_reason }
    cancelWithdrawal: builder.mutation({
      query: ({ requestId, rejection_reason }) => ({
        url: `admin/withdrawals/${requestId}/`,
        method: "PATCH",
        body: { status: "cancelled", rejection_reason },
      }),
      invalidatesTags: (result, error, { requestId }) => [
        "withdrawals",
        { type: "withdrawal-detail", id: requestId },
      ],
    }),
  }),
});

export const {
  // Coupons
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDisableCouponMutation,
  useDeleteCouponMutation,
  // Settings
  useGetSettingsQuery,
  useUpdateSettingMutation,
  // Withdrawals
  useGetWithdrawalsQuery,
  useGetWithdrawalByIdQuery,
  useApproveWithdrawalMutation,
  useCancelWithdrawalMutation,
} = couponApi;
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

    // GET /admin/settings/ — fetch all platform settings
    getSettings: builder.query({
      query: () => ({
        url: `admin/settings/`,
        method: "GET",
      }),
      providesTags: ["settings"],
    }),

    // POST /admin/settings/ — upsert a single setting by key
    // body: { key, value, description }
    updateSetting: builder.mutation({
      query: (data) => ({
        url: `admin/settings/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),

    // GET /admin/withdrawals/?status=pending|processing|paid|cancelled&search=&ordering=
    getWithdrawals: builder.query({
      query: (params = {}) => {
        const q = new URLSearchParams();
        if (params.status)        q.set("status", params.status);
        if (params.payout_method) q.set("payout_method", params.payout_method);
        if (params.search)        q.set("search", params.search);
        if (params.ordering)      q.set("ordering", params.ordering);
        const qs = q.toString();
        return { url: qs ? `admin/withdrawals/?${qs}` : `admin/withdrawals/`, method: "GET" };
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

    // PATCH /admin/withdrawals/:requestId/ — approve: { status: "paid" }
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

    // PATCH /admin/withdrawals/:requestId/ — cancel: { status: "cancelled", rejection_reason }
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

    // ─── Support / Complaints ──────────────────────────────────────────────────

    // GET /admin/support/ — returns a plain array (no pagination wrapper)
    getComplaints: builder.query({
      query: () => ({
        url: `admin/support/`,
        method: "GET",
      }),
      providesTags: ["complaints"],
    }),

    // GET /admin/support/user/:userId/history/
    getUserComplaintHistory: builder.query({
      query: (userId) => ({
        url: `admin/support/user/${userId}/history/`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "user-history", id: userId },
      ],
    }),

    // PATCH /admin/support/:supportId/ — body: { status, response_message }
    respondToComplaint: builder.mutation({
      query: ({ supportId, ...data }) => ({
        url: `admin/support/${supportId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { supportId }) => [
        "complaints",
        { type: "user-history" },
      ],
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
  useGetSettingsQuery,
  useUpdateSettingMutation,
  useGetWithdrawalsQuery,
  useGetWithdrawalByIdQuery,
  useApproveWithdrawalMutation,
  useCancelWithdrawalMutation,
  useGetComplaintsQuery,
  useGetUserComplaintHistoryQuery,
  useRespondToComplaintMutation,
} = couponApi;
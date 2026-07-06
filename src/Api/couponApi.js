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

    // GET /admin/dashboard/users/stats/ — user overview stats (total/active/suspended by type)
    getUserStats: builder.query({
      query: () => ({
        url: `admin/dashboard/users/stats/`,
        method: "GET",
      }),
      providesTags: ["user-stats"],
    }),

    // GET /admin/settings/ — fetch all platform settings
    getSettings: builder.query({
      query: () => ({
        url: `admin/settings/`,
        method: "GET",
      }),
      providesTags: ["settings"],
    }),

    // GET /admin/transactions/stats/ — overview stats for transactions
    getTransactionStats: builder.query({
      query: () => ({
        url: `admin/transactions/stats/`,
        method: "GET",
      }),
      providesTags: ["transactions-stats"],
    }),

    // GET /admin/transactions/ — list all transactions with optional filters
    getTransactions: builder.query({
      query: (params = {}) => {
        const q = new URLSearchParams();
        if (params.payment_status)
          q.set("payment_status", params.payment_status);
        if (params.page) q.set("page", params.page);
        if (params.limit) q.set("limit", params.limit);
        if (params.search) q.set("search", params.search);
        const qs = q.toString();
        return {
          url: qs ? `admin/transactions/?${qs}` : `admin/transactions/`,
          method: "GET",
        };
      },
      providesTags: ["transactions"],
    }),

    // GET /admin/transactions/:transactionId/ — transaction detail
    getTransactionById: builder.query({
      query: (transactionId) => ({
        url: `admin/transactions/${transactionId}/`,
        method: "GET",
      }),
      providesTags: (result, error, transactionId) => [
        { type: "transaction-detail", id: transactionId },
      ],
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
        if (params.status) q.set("status", params.status);
        if (params.payout_method) q.set("payout_method", params.payout_method);
        if (params.search) q.set("search", params.search);
        if (params.ordering) q.set("ordering", params.ordering);
        const qs = q.toString();
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

    // ─── Pricing Rules ─────────────────────────────────────────────────────────

    // GET /admin/pricing-rules/
    getPricingRules: builder.query({
      query: () => ({ url: `admin/pricing-rules/`, method: "GET" }),
      providesTags: ["pricing-rules"],
    }),

    // POST /admin/pricing-rules/
    createPricingRule: builder.mutation({
      query: (data) => ({
        url: `admin/pricing-rules/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pricing-rules"],
    }),

    // PATCH /admin/pricing-rules/:pricingId/
    updatePricingRule: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `admin/pricing-rules/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["pricing-rules"],
    }),

    // DELETE /admin/pricing-rules/:pricingId/
    deletePricingRule: builder.mutation({
      query: (id) => ({ url: `admin/pricing-rules/${id}/`, method: "DELETE" }),
      invalidatesTags: ["pricing-rules"],
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
  useGetUserStatsQuery,
  useGetSettingsQuery,
  useGetTransactionStatsQuery,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useUpdateSettingMutation,
  useGetWithdrawalsQuery,
  useGetWithdrawalByIdQuery,
  useApproveWithdrawalMutation,
  useCancelWithdrawalMutation,
  useGetComplaintsQuery,
  useGetUserComplaintHistoryQuery,
  useRespondToComplaintMutation,
  useGetPricingRulesQuery,
  useCreatePricingRuleMutation,
  useUpdatePricingRuleMutation,
  useDeletePricingRuleMutation,
} = couponApi;
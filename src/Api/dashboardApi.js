import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlatformAdminStats: builder.query({
      query: () => ({
        url: "platform/admin/stats/",
        method: "GET",
      }),
      providesTags: ["stats"],
    }),

    getMonthlyRevenueStats: builder.query({
      query: () => ({
        url: "adminapi/revenue-Monthly-stats/",
        method: "GET",
      }),
      providesTags: ["revenue"],
    }),

    getUserMonthlyStats: builder.query({
      query: () => ({
        url: "adminapi/user-Monthly-stats/",
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    getUserDetails: builder.query({
      query: (userId) => ({
        url: `/admin/users/${userId}/`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [{ type: "users", id: userId }],
    }),

    getUserStats: builder.query({
      query: (userId) => ({
        url: `adminapi/user-stats/${userId}/`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "user-stats", id: userId },
      ],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/userapi/delete-user/${userId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    // Block/unblock user
    blockPlatformUser: builder.mutation({
      // expects { userId, status } as param, PATCH to /platform/admin/block-user/:userId/
      query: ({ userId, status }) => ({
        url: `platform/admin/block-user/${userId}/`,
        method: "PATCH",
        body: { is_blocked: status },
      }),
      invalidatesTags: ["users"],
    }),

    // Activate/suspend user via admin action endpoint
    updatePlatformUserStatus: builder.mutation({
      query: ({ userId, is_active }) => ({
        url: `/admin/users/${userId}/action/`,
        method: "POST",
        body: { is_active },
      }),
      invalidatesTags: ["users"],
    }),

    withdrawEarnings: builder.mutation({
      query: (data) => ({
        url: `platform/admin/withdrawals/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["transactions"],
    }),

    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `platform/admin/transactions/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["transactions"],
    }),

    updateCommission: builder.mutation({
      query: (data) => ({
        url: `platform/commision/list/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["commission"],
    }),

    // Platform user endpoints
    getPlatformDrivers: builder.query({
      query: () => ({
        url: "platform/admin/drivers/",
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getPlatformNormalUsers: builder.query({
      query: () => ({
        url: "platform/admin/normal-users/",
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getPlatformNewDriverRequests: builder.query({
      query: () => ({
        url: "platform/admin/new-driver-requests/",
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    // Trips endpoint for admin trip tracking
    getPlatformTrips: builder.query({
      query: (params) => {
        const qs =
          params && Object.keys(params).length
            ? `?${new URLSearchParams(params).toString()}`
            : "";
        return {
          url: `platform/admin/trips/${qs}`,
          method: "GET",
        };
      },
      providesTags: ["trips"],
    }),

    // Notifications endpoint
    getPlatformNotifications: builder.query({
      query: () => ({
        url: `platform/admin/notifications/`,
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `platform/admin/notifications/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["notifications"],
    }),

    // Transactions (Earnings) endpoint
    getPlatformTransactions: builder.query({
      query: () => ({
        url: "platform/admin/transactions/",
        method: "GET",
      }),
      providesTags: ["transactions"],
    }),

    // About Us endpoints
    getPlatformAboutUs: builder.query({
      query: () => ({
        url: "platform/about-us/",
        method: "GET",
      }),
      providesTags: ["about"],
    }),

    updatePlatformAboutUs: builder.mutation({
      query: (payload) => ({
        url: "platform/about-us/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["about"],
    }),

    // Privacy Policy endpoints
    getPlatformPrivacyPolicy: builder.query({
      query: () => ({
        url: "platform/privacy-and-policy/",
        method: "GET",
      }),
      providesTags: ["privacy"],
    }),

    updatePlatformPrivacyPolicy: builder.mutation({
      query: (payload) => ({
        url: "platform/privacy-and-policy/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["privacy"],
    }),

    // Terms & Conditions endpoints
    getPlatformTermsAndConditions: builder.query({
      query: () => ({
        url: "platform/terms-and-conditions/",
        method: "GET",
      }),
      providesTags: ["terms"],
    }),

    updatePlatformTermsAndConditions: builder.mutation({
      query: (payload) => ({
        url: "platform/terms-and-conditions/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["terms"],
    }),

    // Admin change password
    updatePlatformAdminPassword: builder.mutation({
      query: (payload) => ({
        url: "platform/admin/password/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [],
    }),

    // Admin profile endpoints
    getPlatformAdminProfile: builder.query({
      query: () => ({
        url: "platform/admin/profile/",
        method: "GET",
      }),
      providesTags: ["profile"],
    }),

    updatePlatformAdminProfile: builder.mutation({
      query: (payload) => ({
        url: "platform/admin/profile/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["profile"],
    }),

    // Trip detail endpoint
    getPlatformTripById: builder.query({
      query: (id) => ({
        url: `platform/admin/trips/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "trips", id }],
    }),

    // Driver trip history endpoint
    getPlatformDriverTrips: builder.query({
      query: (driverId) => ({
        url: `platform/admin/driver-trips/${driverId}/`,
        method: "GET",
      }),
      providesTags: (result, error, driverId) => [
        { type: "trips", id: driverId },
      ],
    }),

    // Individual detail endpoints
    getPlatformUserById: builder.query({
      query: (id) => ({
        url: `platform/admin/users/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "users", id }],
    }),
    getPlatformDriverById: builder.query({
      query: (id) => ({
        url: `platform/admin/drivers/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "users", id }],
    }),

    // Approve / Reject driver application
    approvePlatformDriver: builder.mutation({
      query: ({ driverId, action }) => ({
        url: `platform/admin/approve-driver/${driverId}/`,
        method: "PATCH",
        body: { action },
      }),
      invalidatesTags: ["users"],
    }),

    getUsers: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.set(key, value);
          }
        });

        const qs = queryParams.toString();

        return {
          url: `/admin/users/${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["users"],
    }),

    sendUserEmail: builder.mutation({
      query: ({ userId, email, subject, message }) => ({
        url: `/admin/users/${userId}/send-email/`,
        method: "POST",
        body: { email, subject, message },
      }),
    }),

    getAdminDrivers: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.set(key, value);
          }
        });

        const qs = queryParams.toString();

        return {
          url: `/admin/drivers/${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["drivers"],
    }),

    getAdminDriverDetails: builder.query({
      query: (driverId) => ({
        url: `/admin/drivers/${driverId}/`,
        method: "GET",
      }),
      providesTags: (result, error, driverId) => [
        { type: "drivers", id: driverId },
      ],
    }),

    sendDriverEmail: builder.mutation({
      query: ({ driverId, email, subject, message }) => ({
        url: `/admin/drivers/${driverId}/send-email/`,
        method: "POST",
        body: { email, subject, message },
      }),
    }),

    updateDriverKyc: builder.mutation({
      query: ({ driverId, kyc_status, rejection_reason, women_safe }) => ({
        url: `/admin/drivers/${driverId}/kyc/`,
        method: "PATCH",
        body: {
          kyc_status,
          ...(rejection_reason ? { rejection_reason } : {}),
          ...(women_safe !== undefined ? { women_safe } : {}),
        },
      }),
      invalidatesTags: (result, error, { driverId }) => [
        "drivers",
        { type: "drivers", id: driverId },
      ],
    }),

    platformAdminProfile: builder.query({
      query: () => ({
        url: `platform/admin/profile/`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    getCommisionRate: builder.query({
      query: () => ({
        url: "platform/commision/list/create/",
        method: "GET",
      }),
      providesTags: ["users"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetPlatformAdminStatsQuery,
  useGetMonthlyRevenueStatsQuery,
  useGetUserMonthlyStatsQuery,
  useGetPlatformDriversQuery,
  useGetPlatformNormalUsersQuery,
  useGetPlatformNewDriverRequestsQuery,
  useGetPlatformUserByIdQuery,
  useGetPlatformDriverByIdQuery,
  useApprovePlatformDriverMutation,
  useGetUsersQuery,
  useSendUserEmailMutation,
  useGetAdminDriversQuery,
  useGetAdminDriverDetailsQuery,
  useSendDriverEmailMutation,
  useUpdateDriverKycMutation,
  useGetUserDetailsQuery,
  useGetUserStatsQuery,
  useDeleteUserMutation,
  useBlockPlatformUserMutation,
  useWithdrawEarningsMutation,
  useDeleteTransactionMutation,
  useUpdateCommissionMutation,
  useGetPlatformTripsQuery,
  useGetPlatformTripByIdQuery,
  useGetPlatformDriverTripsQuery,
  useGetPlatformTransactionsQuery,
  useGetPlatformNotificationsQuery,
  useDeleteNotificationMutation,
  useGetPlatformAboutUsQuery,
  useUpdatePlatformAboutUsMutation,
  useGetPlatformPrivacyPolicyQuery,
  useUpdatePlatformPrivacyPolicyMutation,
  useGetPlatformTermsAndConditionsQuery,
  useUpdatePlatformTermsAndConditionsMutation,
  useUpdatePlatformAdminPasswordMutation,
  useGetPlatformAdminProfileQuery,
  useUpdatePlatformAdminProfileMutation,
  useGetCommisionRateQuery,
  useUpdatePlatformUserStatusMutation,
} = authApi;

import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/admin/login/",
        method: "POST",
        body: {
          email: data.email,
          password: data.password,
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
} = authApi;

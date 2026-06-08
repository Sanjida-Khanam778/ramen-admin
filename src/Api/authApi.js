import { setCredentials } from "../features/authSlice";
import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login/",
        method: "POST",
        body: {
          login_id: data.email || data.login_id,
          password: data.password,
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
} = authApi;

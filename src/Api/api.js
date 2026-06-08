import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://api.rydeislands.com/api/v1/",
  prepareHeaders: (headers, { getState }) => {
    // Add stored access token so protected endpoints succeed
    const token = getState()?.auth?.access;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});

export const api = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQuery,
  tagTypes: ["users", "auth", "stats"],
  endpoints: () => ({}),
});

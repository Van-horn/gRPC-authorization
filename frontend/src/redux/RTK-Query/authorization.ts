import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  RegistrationData,
  Credentials,
  LogoutResponse,
  LogoutData,
  LoginData,
  RefreshData,
  ForgotPasswordData,
} from "types-for-store/src/authentication-microservice";

import baseUrl from "./url";

export const authorization = createApi({
  reducerPath: "authorization",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl + "/authorization" }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    registration: builder.mutation<Credentials, RegistrationData>({
      query: (data) => ({ url: "/registration", method: "POST", body: data }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation<Credentials, LoginData>({
      query: (data) => ({ url: "/login", method: "PATCH", body: data }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<LogoutResponse, LogoutData>({
      query: (data) => ({ url: "/logout", method: "PATCH", body: data }),
      invalidatesTags: ["Auth"],
    }),
    refresh: builder.mutation<Credentials, RefreshData>({
      query: (data) => ({ url: "/refresh", method: "PATCH", body: data }),
      invalidatesTags: ["Auth"],
    }),
    forgotPassword: builder.mutation<Credentials, ForgotPasswordData>({
      query: (data) => ({
        url: "/forgotPassword",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useRegistrationMutation, useRefreshMutation } = authorization;

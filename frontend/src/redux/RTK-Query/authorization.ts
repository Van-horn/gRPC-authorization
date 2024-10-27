import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthorizationController } from "types-for-store";

import baseUrl from "./url";
import { removeItem, setItem } from "../../utils/localStorage";

export const authorization = createApi({
  reducerPath: "authorization",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl + "/authorization" }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    registration: builder.mutation<
      AuthorizationController.RegistrationResponse,
      AuthorizationController.RegistrationRequest
    >({
      query: (data) => ({ url: "/registration", method: "POST", body: data }),
      transformResponse: (
        response: AuthorizationController.RegistrationResponse
      ) => {
        setItem("accessToken", response.accessToken);

        return response;
      },
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation<
      AuthorizationController.LoginResponse,
      AuthorizationController.LoginRequest
    >({
      query: (data) => ({ url: "/login", method: "PATCH", body: data }),
      transformResponse: (response: AuthorizationController.LoginResponse) => {
        setItem("accessToken", response.accessToken);

        return response;
      },
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<
      AuthorizationController.LogoutResponse,
      AuthorizationController.LogoutRequest
    >({
      query: (data) => ({ url: "/logout", method: "PATCH", body: data }),
      transformResponse: (response: AuthorizationController.LogoutResponse) => {
        removeItem("accessToken");

        return response;
      },
      invalidatesTags: ["Auth"],
    }),
    refresh: builder.mutation<
      AuthorizationController.RefreshResponse,
      AuthorizationController.RefreshRequest
    >({
      query: (data) => ({ url: "/refresh", method: "PATCH", body: data }),
      transformResponse: (
        response: AuthorizationController.RefreshResponse
      ) => {
        setItem("accessToken", response.accessToken);

        return response;
      },

      invalidatesTags: ["Auth"],
    }),
    forgotPassword: builder.mutation<
      AuthorizationController.ForgotPasswordResponse,
      AuthorizationController.ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/forgotPassword",
        method: "PATCH",
        body: data,
      }),
      transformResponse: (
        response: AuthorizationController.ForgotPasswordResponse
      ) => {
        setItem("accessToken", response.accessToken);

        return response;
      },
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegistrationMutation,
  useRefreshMutation,
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
} = authorization;

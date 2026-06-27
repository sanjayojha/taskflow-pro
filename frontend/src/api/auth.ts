import type { ApiSuccess, User } from "@/types";
import { api } from "./axios";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginResponseData {
    accessToken: string;
    user: User;
}

export const authApi = {
    login: (payload: LoginPayload) => api.post<ApiSuccess<LoginResponseData>>("/auth/login", payload),
    register: (payload: RegisterPayload) => api.post<ApiSuccess<{ message: string }>>("/auth/register", payload),
    logout: () => api.post<ApiSuccess<null>>("/auth/logout"),
    refresh: () => api.post<ApiSuccess<{ accessToken: string }>>("/auth/refresh"),
    me: () => api.get<ApiSuccess<User>>("/auth/me"),
    verifyEmail: (token: string) => api.get<ApiSuccess<null>>(`/auth/verify-email/${token}`),
    forgotPassword: (email: string) => api.post<ApiSuccess<null>>("/auth/forgot-password", { email }),
    resetPassword: (token: string, password: string, confirmPassword: string) => api.post<ApiSuccess<null>>(`/auth/reset-password/${token}`, { password, confirmPassword }),
};

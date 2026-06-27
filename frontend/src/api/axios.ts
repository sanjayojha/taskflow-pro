import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken } from "./tokenStore";
import type { ApiSuccess } from "@/types";

// -- Axios instance
export const api = axios.create({
    baseURL: "/api/v1",
    withCredentials: true, // sends the httpOnly refresh-token cookie automatically
    headers: {
        "Content-Type": "application/json",
    },
});

// -- Request interceptor; attach access token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// -- Response interceptor, silent refresh on 401, single retry
type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let pendingQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}> = [];

const resolveQueue = (token: string): void => {
    pendingQueue.forEach(({ resolve }) => resolve(token));
    pendingQueue = [];
};

const rejectQueue = (error: unknown): void => {
    pendingQueue.forEach(({ reject }) => reject(error));
    pendingQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetriableConfig;

        const isAuthEndpoint = originalRequest?.url?.includes("/auth/refresh") || originalRequest?.url?.includes("/auth/login");

        if (error.response?.status !== 401 || originalRequest._retry || isAuthEndpoint) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            // Another request already triggered a refresh, wait for it.
            return new Promise((resolve, reject) => {
                pendingQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest._retry = true;
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await api.post<ApiSuccess<{ accessToken: string }>>("/auth/refresh");
            const newToken = data.data.accessToken;
            setAccessToken(newToken);
            resolveQueue(newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            rejectQueue(refreshError);
            setAccessToken(null);
            window.location.href = "/login";
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

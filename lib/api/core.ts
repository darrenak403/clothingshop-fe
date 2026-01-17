/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { store } from "@/lib/redux/store";
import { logout, setCredentials } from "@/lib/redux/slices/authSlice";
import { toast } from "sonner";

export interface ApiError {
  code?: number;
  message: string;
  status: boolean;
  data?: unknown;
}

class ApiService {
  private client: AxiosInstance;
  private authToken: string | null = null;
  private isRefreshing = false;
  private refreshQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  constructor(baseURL: string, timeout = 10000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token from Redux store
        const token = store.getState().auth.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Handle FormData - remove Content-Type to let browser set it with boundary
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Skip refresh logic for login, register, and refresh-token requests
          if (
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register") ||
            originalRequest.url?.includes("/auth/refresh-token")
          ) {
            // For auth endpoints, don't retry - just show error
          } else {
            originalRequest._retry = true;

            // Nếu đang refresh token, đợi kết quả
            if (this.isRefreshing) {
              return new Promise((resolve, reject) => {
                this.refreshQueue.push({ resolve, reject });
              })
                .then((token) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  return this.client(originalRequest);
                })
                .catch((err) => {
                  return Promise.reject(err);
                });
            }

            this.isRefreshing = true;

            try {
              const newToken = await this.refreshAccessToken();

              // Update token cho request hiện tại
              originalRequest.headers.Authorization = `Bearer ${newToken}`;

              // Xử lý tất cả requests đang đợi
              this.refreshQueue.forEach(({ resolve }) => resolve(newToken));
              this.refreshQueue = [];
              this.isRefreshing = false;

              // Retry request ban đầu
              return this.client(originalRequest);
            } catch (refreshError) {
              // Refresh thất bại -> Logout user
              this.refreshQueue.forEach(({ reject }) => reject(refreshError));
              this.refreshQueue = [];
              this.isRefreshing = false;
              this.handleLogout();
              return Promise.reject(refreshError);
            }
          }
        }

        // Standardize error format
        const apiError: ApiError = {
          code: error.response?.status,
          message:
            error.response?.data?.errors ||
            error.response?.data?.message ||
            error.message ||
            "Có lỗi xảy ra",
          status: false,
          data: error.response?.data,
        };

        // Show toast for different error types
        if (error.response?.status === 401) {
          if (originalRequest.url?.includes("/auth/login")) {
            // For login errors, show the specific message from backend
            const errorMessage = apiError.message;
            toast.error(errorMessage || "Đăng nhập thất bại");
          } else {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          }
        } else if (error.response?.status === 403) {
          if (originalRequest.url?.includes("/auth/login")) {
            // Account locked message
            const errorMessage = apiError.message;
            toast.error(errorMessage || "Tài khoản bị khóa");
          } else {
            toast.error("Bạn không có quyền truy cập chức năng này.");
          }
        } else if (error.response?.status >= 500) {
          toast.error("Lỗi máy chủ. Vui lòng thử lại sau.");
        } else if (error.response?.status >= 400) {
          // Client errors - show specific message if available
          const errorMessage = apiError.message;
          if (errorMessage && errorMessage !== "Có lỗi xảy ra") {
            toast.error(errorMessage);
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  // Refresh access token
  private async refreshAccessToken(): Promise<string> {
    try {
      const refreshToken = store.getState().auth.refreshToken || getCookie("refresh-token");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await this.client.post<{
        status: number;
        success: boolean;
        message: string;
        data: {
          accessToken: string;
          refreshToken: string;
          user: {
            userId: string;
            email: string;
            fullName: string;
            roleName: string;
          };
        };
      }>("/auth/refresh-token", { refreshToken });

      if (response.data.success && response.data.data.accessToken) {
        const { accessToken, refreshToken: newRefreshToken, user } = response.data.data;

        // Lưu tokens vào cookie
        setCookie("auth-token", accessToken, { maxAge: 7 * 24 * 60 * 60, path: "/" });
        setCookie("refresh-token", newRefreshToken, { maxAge: 30 * 24 * 60 * 60, path: "/" });

        // Cập nhật Redux store
        store.dispatch(
          setCredentials({
            token: accessToken,
            refreshToken: newRefreshToken,
            user: {
              id: user.userId,
              email: user.email,
              name: user.fullName,
              role: user.roleName,
            },
          })
        );

        return accessToken;
      }

      throw new Error("Refresh token failed");
    } catch (error) {
      throw error;
    }
  }

  // Handle logout
  private handleLogout() {
    deleteCookie("auth-token", { path: "/" });
    deleteCookie("refresh-token", { path: "/" });
    store.dispatch(logout());

    // Show logout toast
    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

    // Dispatch logout event for other tabs/windows
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("logout"));
      // Redirect to login page
      window.location.href = "/sign-in";
    }
  }

  // Set auth token manually (for initial sync)
  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.client.request<T>(config);
    } catch (error) {
      throw error;
    }
  }

  // GET with query params
  async get<T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: "GET",
      url,
      params: params ? new URLSearchParams(params) : undefined,
    });
  }

  // POST
  async post<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: "POST",
      url,
      data,
    });
  }

  // PUT
  async put<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: "PUT",
      url,
      data,
    });
  }

  // PATCH
  async patch<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: "PATCH",
      url,
      data,
    });
  }

  // DELETE
  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: "DELETE",
      url,
    });
  }

  // File upload with progress
  async upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: "POST",
      url,
      data: formData,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
  }
}

// Singleton instance
const apiService = new ApiService(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:6789",
  600000 // 10 minutes timeout
);

export default apiService;

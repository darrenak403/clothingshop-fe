/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setCookie, deleteCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import apiService from "@/lib/api/core";
import type { RootState } from "../store";

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const registerAsync = createAsyncThunk(
  "auth/register",
  async (
    credentials: {
      fullName: string;
      email: string;
      password: string;
      phoneNumber: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.post<{
        status: number;
        success: boolean;
        message: string;
        data: { user: User };
        errors: any;
      }>("/auth/register", credentials);

      if (response.data.success) {
        return response.data.data.user;
      }

      return rejectWithValue(response.data.message || "Registration failed");
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post<{
        status: number;
        success: boolean;
        message: string;
        data: { accessToken: string; refreshToken: string; user: User };
        errors: any;
      }>("/auth/login", credentials);

      if (response.data.success && response.data.data.accessToken) {
        const { accessToken, refreshToken, user } = response.data.data;

        // Lưu cả 2 tokens vào cookie
        setCookie("auth-token", accessToken, { maxAge: 7 * 24 * 60 * 60, path: "/" });
        setCookie("refresh-token", refreshToken, { maxAge: 30 * 24 * 60 * 60, path: "/" });
        apiService.setAuthToken(accessToken);

        return { token: accessToken, refreshToken, user };
      }

      return rejectWithValue(response.data.message || "Login failed");
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const refreshToken = state.auth.refreshToken;

      // Gửi refreshToken để logout trên server
      if (refreshToken) {
        await apiService.post("/auth/logout", { refreshToken });
      }

      // Xóa cả 2 tokens
      deleteCookie("auth-token", { path: "/" });
      deleteCookie("refresh-token", { path: "/" });
      apiService.setAuthToken(null);
      return true;
    } catch (error: any) {
      // Vẫn logout local dù API fail
      deleteCookie("auth-token", { path: "/" });
      deleteCookie("refresh-token", { path: "/" });
      apiService.setAuthToken(null);
      return rejectWithValue(error.message);
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const oldRefreshToken = state.auth.refreshToken;

      if (!oldRefreshToken) {
        return rejectWithValue("No refresh token available");
      }

      const response = await apiService.post<{
        status: number;
        success: boolean;
        message: string;
        data: { accessToken: string; refreshToken: string; user: User };
        errors: any;
      }>("/auth/refresh-token", { refreshToken: oldRefreshToken });

      if (response.data.success && response.data.data.accessToken) {
        const { accessToken, refreshToken, user } = response.data.data;

        // Cập nhật cả 2 tokens mới
        setCookie("auth-token", accessToken, { maxAge: 7 * 24 * 60 * 60, path: "/" });
        setCookie("refresh-token", refreshToken, { maxAge: 30 * 24 * 60 * 60, path: "/" });
        apiService.setAuthToken(accessToken);

        return { token: accessToken, refreshToken, user };
      }

      return rejectWithValue(response.data.message || "Refresh failed");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken?: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.isAuthenticated = true;
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      apiService.setAuthToken(action.payload);

      try {
        const decoded = jwtDecode<User>(action.payload);
        state.user = decoded;
        state.isAuthenticated = true;
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      deleteCookie("auth-token", { path: "/" });
      deleteCookie("refresh-token", { path: "/" });
      apiService.setAuthToken(null);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });

    // Refresh Token
    builder
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

// Actions
export const { setCredentials, setToken, logout, clearError } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export default authSlice.reducer;

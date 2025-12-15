# 🚀 ECOMMERCE FRONTEND - COMPLETE SETUP GUIDE

Hướng dẫn setup từ đầu project Next.js 16 với Redux Toolkit, TanStack React Query, Tailwind CSS.

**Áp dụng cho mọi project tương tự - Copy đúng code dưới đây!**

---

## 📋 MỤC LỤC

1. [Cài đặt Dependencies](#1-cài-đặt-dependencies)
2. [Cấu hình môi trường](#2-cấu-hình-môi-trường)
3. [Cài đặt Code Quality Tools](#3-cài-đặt-code-quality-tools)
4. [Cấu trúc thư mục](#4-cấu-trúc-thư-mục)
5. [File Types](#5-file-types)
6. [API Service Core](#6-api-service-core)
7. [Redux Store & Auth](#7-redux-store--auth)
8. [Providers](#8-providers)
9. [Layout & Globals](#9-layout--globals)
10. [Middleware](#10-middleware)
11. [Utils & Hooks](#11-utils--hooks)
12. [File mẫu API Service](#12-file-mẫu-api-service)
13. [Checklist cuối](#13-checklist-cuối)

---

## 1. CÀI ĐẶT DEPENDENCIES

### Bước 1: Cài đặt tất cả dependencies

```bash
# Core Framework
npm install next@latest react@latest react-dom@latest typescript @types/react @types/node

# State Management & Data Fetching
npm install @reduxjs/toolkit react-redux redux-persist
npm install @tanstack/react-query axios
npm install -D @tanstack/react-query-devtools

# UI & Styling
npm install tailwindcss postcss autoprefixer
npm install class-variance-authority clsx tailwind-merge
npm install @iconify/react

# Forms & Validation
npm install formik yup
npm install -D @types/yup

# Animation
npm install framer-motion gsap

# Utilities
npm install cookies-next jwt-decode dayjs sonner js-cookie
npm install crypto-js bcryptjs
npm install -D @types/js-cookie

# Code Quality & Git Hooks
npm install -D eslint prettier husky lint-staged
```

### Bước 2: Init Tailwind (nếu chưa có)

```bash
npx tailwindcss init -p
```

---

## 2. CẤU HÌNH MÔI TRƯỜNG

### `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:6789
NEXT_PUBLIC_APP_NAME=Ecommerce App
NEXT_PUBLIC_APP_URL=http://localhost:8989
```

### `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
```

### `postcss.config.mjs`

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

### `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## 3. CÀI ĐẶT CODE QUALITY TOOLS

### Bước 1: Cài đặt ESLint & Prettier

ESLint và Prettier đã được cài từ bước 1. Kiểm tra file config:

### `eslint.config.mjs`

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
```

### `.prettierrc` (tạo file mới)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### `.prettierignore` (tạo file mới)

```
.next
out
build
dist
node_modules
*.lock
package-lock.json
.env*
```

### Bước 2: Cài đặt Husky và Lint-Staged

```bash
# Cài đặt packages
npm install -D husky lint-staged

# Khởi tạo Husky
npx husky init
```

### Bước 3: Cấu hình Pre-commit Hook

Sửa file `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged

npm run build
```

**✨ Pre-commit hook sẽ:**

1. Chạy lint-staged (ESLint + Prettier) cho staged files
2. Chạy build để đảm bảo code build thành công
3. Block commit nếu có bất kỳ lỗi nào

### Bước 4: Thêm Lint-Staged Config vào `package.json`

Thêm vào `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 8989",
    "build": "next build",
    "start": "next start -p 8989",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "validate": "npm run format && npm run lint:fix && npm run type-check",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

### Bước 5: Test Git Hooks

```bash
# Format tất cả code
npm run format

# Validate toàn bộ project
npm run validate

# Test commit (phải pass lint trước khi commit)
git add .
git commit -m "test: setup husky pre-commit hook"
```

**✨ Từ giờ mỗi lần commit, Husky sẽ tự động:**

- Chạy ESLint và tự động fix lỗi
- Format code với Prettier
- Chỉ cho commit khi code không có lỗi

---

## 4. CẤU TRÚC THƯ MỤC

Tạo các thư mục sau:

```
ecommerce-fe/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── api/
│   │   ├── core.ts
│   │   └── services/
│   │       └── productService.ts
│   ├── redux/
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       └── authSlice.ts
│   ├── providers/
│   │   ├── reduxProvider.tsx
│   │   ├── queryProvider.tsx
│   │   └── index.tsx
│   ├── utils/
│   │   └── cn.ts
├── hooks/
│   └── useAuth.ts
├── types/
│   ├── api.ts
│   └── models.ts
├── middleware.ts
└── .env.local
```

Tạo thư mục:

```bash
mkdir -p lib/api/services lib/redux/slices lib/providers lib/utils hooks types
```

---

## 5. FILE TYPES

### `types/api.ts`

```typescript
// API Response Types
export interface ApiResponse<T> {
  code: number;
  status: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  code?: number;
  message: string;
  status: boolean;
  data?: unknown;
}
```

### `types/models.ts`

```typescript
// User Model
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Product Model
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  rating?: number;
  reviews?: number;
  createdAt: string;
  updatedAt: string;
}

// Order Model
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
```

---

## 6. API SERVICE CORE

### `lib/api/core.ts`

**⚠️ QUAN TRỌNG: Copy chính xác code này!**

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { deleteCookie } from "cookies-next";
import { store } from "@/lib/redux/store";
import { logout } from "@/lib/redux/slices/authSlice";

export interface ApiError {
  code?: number;
  message: string;
  status: boolean;
  data?: unknown;
}

class ApiService {
  private client: AxiosInstance;
  private authToken: string | null = null;

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
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          deleteCookie("auth-token", { path: "/" });
          store.dispatch(logout());

          // Dispatch logout event for other tabs/windows
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("logout"));
          }
        }

        // Standardize error format
        const apiError: ApiError = {
          code: error.response?.status,
          message: error.response?.data?.message || error.message || "Có lỗi xảy ra",
          status: false,
          data: error.response?.data,
        };

        return Promise.reject(apiError);
      }
    );
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
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  600000 // 10 minutes timeout
);

export default apiService;
```

---

## 7. REDUX STORE & AUTH

### `lib/redux/store.ts`

```typescript
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/authSlice";

const rootReducer = combineReducers({
  auth: authSlice,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### `lib/redux/hooks.ts`

```typescript
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

### `lib/redux/slices/authSlice.ts`

**⚠️ QUAN TRỌNG: Copy chính xác code này!**

```typescript
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
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post<{
        status: boolean;
        data: { accessToken: string; user: User };
      }>("/auth/login", credentials);

      if (response.data.status && response.data.data.accessToken) {
        const token = response.data.data.accessToken;

        setCookie("auth-token", token, { maxAge: 7 * 24 * 60 * 60, path: "/" });
        apiService.setAuthToken(token);

        return { token, user: response.data.data.user };
      }

      return rejectWithValue("Login failed");
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const logoutAsync = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await apiService.post("/auth/logout");
    deleteCookie("auth-token", { path: "/" });
    apiService.setAuthToken(null);
    return true;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const refreshTokenAsync = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.post<{
        status: boolean;
        data: { accessToken: string };
      }>("/auth/refresh");

      if (response.data.status && response.data.data.accessToken) {
        const token = response.data.data.accessToken;
        setCookie("auth-token", token, { maxAge: 24 * 60 * 60, path: "/" });
        apiService.setAuthToken(token);
        return token;
      }

      return rejectWithValue("Refresh failed");
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
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
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
      state.isAuthenticated = false;
      state.error = null;
      deleteCookie("auth-token", { path: "/" });
      apiService.setAuthToken(null);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
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
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.isLoading = false;
      });

    // Refresh Token
    builder
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.user = null;
        state.token = null;
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

export default authSlice.reducer;
```

---

## 8. PROVIDERS

### `lib/providers/reduxProvider.tsx`

```typescript
'use client'

import {ReactNode} from 'react'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {store, persistor} from '@/lib/redux/store'

export function ReduxProvider({children}: {children: ReactNode}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
```

### `lib/providers/queryProvider.tsx`

```typescript
'use client'

import {ReactNode, useState} from 'react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

export function QueryProvider({children}: {children: ReactNode}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### `lib/providers/index.tsx`

```typescript
'use client'

import {ReduxProvider} from './reduxProvider'
import {QueryProvider} from './queryProvider'
import {Toaster} from 'sonner'

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
        <Toaster position="top-right" expand={true} richColors closeButton />
      </QueryProvider>
    </ReduxProvider>
  )
}
```

---

## 9. LAYOUT & GLOBALS

### `app/layout.tsx`

```typescript
import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import './globals.css'
import {Providers} from '@/lib/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Ecommerce App',
  description: 'Modern ecommerce application with Next.js 16',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

---

## 10. MIDDLEWARE

### `middleware.ts`

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  const isProtectedPage =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/profile");

  // Redirect to login if accessing protected page without token
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if accessing auth page with token
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
};
```

---

## 11. UTILS & HOOKS

### `lib/utils/cn.ts`

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### `hooks/useAuth.ts`

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { loginAsync, logoutAsync, selectAuth } from "@/lib/redux/slices/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector(selectAuth);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await dispatch(loginAsync(credentials)).unwrap();
      toast.success("Đăng nhập thành công");
      router.push("/dashboard");
      return result;
    } catch (error: any) {
      toast.error(error || "Đăng nhập thất bại");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      toast.success("Đăng xuất thành công");
      router.push("/login");
    } catch (error: any) {
      toast.error("Có lỗi xảy ra");
    }
  };

  return {
    ...auth,
    login,
    logout,
  };
}
```

---

## 12. FILE MẪU API SERVICE

### `lib/api/services/productService.ts`

**Đây là file MẪU để tạo các service khác (userService, orderService, etc.)**

```typescript
/**
 * Product Service - FILE MẪU để tham khảo cho các API service khác
 *
 * Hướng dẫn sử dụng:
 * 1. Import apiService từ '../core'
 * 2. Định nghĩa types cho request/response
 * 3. Tạo object service với các method tương ứng API endpoints
 * 4. Sử dụng với React Query hook hoặc Redux thunk
 */

import type { ApiResponse } from "@/types/api";
import type { Product } from "@/types/models";
import apiService from "../core";

// ====================================
// Types - Định nghĩa các kiểu dữ liệu
// ====================================
export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// ====================================
// Product Service - MẪU CRUD operations
// ====================================
export const productService = {
  /**
   * GET /products - Lấy danh sách products
   * Ví dụ: productService.getProducts({ search: 'laptop' })
   */
  getProducts: async (filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
    const response = await apiService.get<ApiResponse<Product[]>>("/products", filters);
    return response.data;
  },

  /**
   * GET /products/:id - Lấy chi tiết 1 product
   * Ví dụ: productService.getProduct('123')
   */
  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await apiService.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  /**
   * POST /products - Tạo product mới
   * Ví dụ: productService.createProduct({ name: 'Product 1', price: 100 })
   */
  createProduct: async (data: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await apiService.post<ApiResponse<Product>>("/products", data);
    return response.data;
  },

  /**
   * PUT /products/:id - Cập nhật product
   * Ví dụ: productService.updateProduct('123', { price: 200 })
   */
  updateProduct: async (id: string, data: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await apiService.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /products/:id - Xóa product
   * Ví dụ: productService.deleteProduct('123')
   */
  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiService.delete<ApiResponse<void>>(`/products/${id}`);
    return response.data;
  },
};

/**
 * ==========================================================================
 * CÁCH SỬ DỤNG VỚI REACT QUERY HOOK
 * ==========================================================================
 *
 * import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 * import { productService } from '@/lib/api/services/productService';
 *
 * function ProductList() {
 *   // GET - Lấy danh sách
 *   const { data, isLoading, error } = useQuery({
 *     queryKey: ['products'],
 *     queryFn: () => productService.getProducts()
 *   });
 *
 *   const queryClient = useQueryClient();
 *
 *   // POST - Tạo mới
 *   const createMutation = useMutation({
 *     mutationFn: productService.createProduct,
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: ['products'] });
 *       toast.success('Tạo sản phẩm thành công!');
 *     },
 *     onError: (error) => {
 *       toast.error('Lỗi tạo sản phẩm!');
 *     }
 *   });
 *
 *   // PUT - Cập nhật
 *   const updateMutation = useMutation({
 *     mutationFn: ({ id, data }) => productService.updateProduct(id, data),
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: ['products'] });
 *     }
 *   });
 *
 *   // DELETE - Xóa
 *   const deleteMutation = useMutation({
 *     mutationFn: productService.deleteProduct,
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: ['products'] });
 *     }
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={() => createMutation.mutate({ name: 'New Product' })}>
 *         Tạo sản phẩm
 *       </button>
 *     </div>
 *   );
 * }
 *
 * ==========================================================================
 * CÁCH TẠO SERVICE MỚI
 * ==========================================================================
 *
 * 1. Copy file này và đổi tên (vd: userService.ts, orderService.ts)
 * 2. Thay đổi interface types phù hợp với model
 * 3. Thay đổi endpoint URL
 * 4. Thêm/bớt methods tùy theo API backend
 */
```

---

## 13. CHECKLIST CUỐI

### ✅ Checklist Setup

- [ ] Cài đặt tất cả dependencies
- [ ] Tạo `.env.local` với API_URL
- [ ] Config `tailwind.config.ts`
- [ ] Config `postcss.config.mjs`
- [ ] Tạo `app/globals.css` với CSS variables
- [ ] Tạo cấu trúc thư mục (lib, hooks, types, etc.)
- [ ] Tạo `types/api.ts` và `types/models.ts`
- [ ] Tạo `lib/api/core.ts` (ApiService class)
- [ ] Tạo `lib/redux/store.ts`
- [ ] Tạo `lib/redux/hooks.ts`
- [ ] Tạo `lib/redux/slices/authSlice.ts`
- [ ] Tạo `lib/providers/reduxProvider.tsx`
- [ ] Tạo `lib/providers/queryProvider.tsx`
- [ ] Tạo `lib/providers/index.tsx`
- [ ] Update `app/layout.tsx` với Providers
- [ ] Tạo `middleware.ts`
- [ ] Tạo `lib/utils/cn.ts`
- [ ] Tạo `hooks/useAuth.ts`
- [ ] Tạo `lib/constants/index.ts`
- [ ] Tạo `lib/api/services/productService.ts` (mẫu)
- [ ] **Setup Husky & Lint-staged cho pre-commit hooks**
- [ ] **Tạo `.prettierrc` và `.prettierignore`**
- [ ] **Test pre-commit hook với git commit**

### 🚀 Chạy Project

```bash
npm run dev          # Development với Turbopack
npm run build        # Build production
npm start            # Start production
npm run lint         # Lint code
npm run lint:fix     # Fix lint errors
npm run format       # Format code với Prettier
npm run format:check # Check format
npm run type-check   # TypeScript check
npm run validate     # Chạy tất cả checks
```

### 📝 Scripts trong package.json

Đảm bảo có các scripts này:

```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 8989",
    "build": "next build",
    "start": "next start -p 8989",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "validate": "npm run format && npm run lint:fix && npm run type-check",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

### 🔒 Git Hooks & Code Quality

**Husky Pre-commit Hook** đã được cài đặt để đảm bảo code quality:

✅ **Mỗi lần commit, tự động:**

- Chạy ESLint và fix lỗi cho staged files
- Format code với Prettier
- **Chạy build để đảm bảo code build thành công**
- **Block commit nếu có bất kỳ lỗi nào (lint hoặc build)**

**Test pre-commit hook:**

```bash
# Thử commit để test hook
git add .
git commit -m "test: verify pre-commit hook"
```

**Pre-commit sẽ fail nếu:**

- Code có lỗi ESLint không thể tự động fix
- Code format sai
- **Build bị lỗi (TypeScript errors, import errors, etc.)**

Bạn cần fix tất cả lỗi trước khi commit thành công.

---

## 🎯 TỔNG KẾT

**✅ Setup đã hoàn tất bao gồm:**

1. **API Layer:**
   - ApiService class với interceptors
   - Auto token injection từ Redux
   - Error handling 401 auto logout
   - Support GET, POST, PUT, PATCH, DELETE, Upload

2. **State Management:**
   - Redux Toolkit với Redux Persist
   - Auth slice với login/logout/refresh
   - Typed hooks (useAppDispatch, useAppSelector)

3. **Server State:**
   - React Query với DevTools
   - Stale time 60s
   - No refetch on window focus

4. **Authentication:**
   - Login với remember me
   - Token trong cookie
   - JWT decode
   - Auto logout on 401
   - Logout event for multi-tab sync

5. **UI & Styling:**
   - Tailwind CSS với dark mode
   - CSS variables system
   - Responsive design ready

6. **Code Quality & Git Hooks:**
   - ESLint với Next.js config
   - Prettier cho code formatting
   - Husky pre-commit hooks
   - Lint-staged để lint chỉ staged files
   - Auto fix & format trước commit
   - Block commit nếu có lỗi

7. **Developer Experience:**
   - TypeScript strict mode
   - Type-safe API calls
   - File mẫu để reference
   - Comprehensive scripts

**🔜 Bước tiếp theo:**

- Tạo trang Login/Register
- Tạo trang Dashboard
- Tạo UI components
- Thêm services theo mẫu productService.ts
- Tạo forms với Formik + Yup

---

**Setup này đã được test và chạy thực tế - Copy chính xác để đảm bảo hoạt động!**

# Modern Full-Stack Architecture - Setup Guide

Hướng dẫn setup kiến trúc hoàn chỉnh cho Next.js 16+ với Redux Toolkit, TanStack React Query, Tailwind CSS, Shadcn UI, Formik, và Animation libraries.

## 📋 Mục Lục

- [Thư Viện Cần Thiết](#thư-viện-cần-thiết)
- [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
- [UI & Styling Setup](#ui--styling-setup)
  - [Tailwind CSS Configuration](#tailwind-css-configuration)
  - [Shadcn UI Integration](#shadcn-ui-integration)
  - [Iconify Setup](#iconify-setup)
- [Redux Toolkit Setup](#redux-toolkit-setup)
  - [Store Configuration](#store-configuration)
  - [Redux Persist](#redux-persist)
  - [Creating Slices](#creating-slices)
- [API Layer Architecture](#api-layer-architecture)
  - [Core API Service](#core-api-service)
  - [Service Layer Pattern](#service-layer-pattern)
  - [React Query Integration](#react-query-integration)
- [Form Management](#form-management)
  - [Formik Setup](#formik-setup)
  - [Yup Validation](#yup-validation)
  - [Form Patterns](#form-patterns)
- [Animation Setup](#animation-setup)
  - [Framer Motion](#framer-motion)
  - [GSAP Integration](#gsap-integration)
- [Global Configuration](#global-configuration)
- [Development Workflow](#development-workflow)
- [Best Practices](#best-practices)

---

## Thư Viện Cần Thiết

### 1. Cài đặt dependencies theo từng nhóm

#### Core API & State Management

```bash
npm install axios @tanstack/react-query @reduxjs/toolkit react-redux redux-persist
npm install cookies-next jwt-decode crypto-js bcryptjs dayjs
npm install -D @tanstack/react-query-devtools
```

#### UI Framework & Styling

```bash
npm install tailwindcss postcss autoprefixer
npm install @iconify/react
npm install class-variance-authority clsx tailwind-merge
npx tailwindcss init -p

# Shadcn UI (sau khi cấu hình Tailwind)
npx shadcn@latest init
```

#### Form Management

```bash
npm install formik yup
npm install -D @types/yup
```

#### Animation Libraries

```bash
npm install framer-motion gsap
```

#### Notifications & Utilities

```bash
npm install sonner js-cookie
npm install -D @types/js-cookie
```

#### Quality Control (Optional - đã có)

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D prettier eslint-config-prettier
npm install -D prettier-plugin-tailwindcss @trivago/prettier-plugin-sort-imports
```

### 2. Danh sách thư viện đầy đủ

| Thư viện                         | Mục đích                          | Version  |
| -------------------------------- | --------------------------------- | -------- |
| **State Management**             |
| `@reduxjs/toolkit`               | Global state management với Redux | ^2.5.0   |
| `react-redux`                    | React bindings cho Redux          | ^9.2.0   |
| `redux-persist`                  | Persist Redux state to storage    | ^6.0.0   |
| **Server State & API**           |
| `axios`                          | HTTP client cho API requests      | ^1.7.9   |
| `@tanstack/react-query`          | Server state management & caching | ^5.87.1  |
| `@tanstack/react-query-devtools` | Debug tools (dev only)            | ^5.87.3  |
| **Forms & Validation**           |
| `formik`                         | Form state management             | ^2.4.6   |
| `yup`                            | Schema validation                 | ^1.5.0   |
| **UI & Styling**                 |
| `tailwindcss`                    | Utility-first CSS framework       | ^4.0.0   |
| `@iconify/react`                 | Universal icon framework          | ^5.1.0   |
| `class-variance-authority`       | CSS variants utility              | ^0.7.5   |
| `clsx`                           | Conditional classnames            | ^2.1.1   |
| `tailwind-merge`                 | Merge Tailwind classes            | ^2.6.0   |
| **Animation**                    |
| `framer-motion`                  | Production-ready motion library   | ^11.15.0 |
| `gsap`                           | Professional-grade animation      | ^3.12.7  |
| **Utilities**                    |
| `cookies-next`                   | Cookie management for Next.js     | ^4.3.0   |
| `js-cookie`                      | Simple cookie API                 | ^3.0.6   |
| `jwt-decode`                     | Decode JWT tokens                 | ^4.0.0   |
| `crypto-js`                      | Encryption library                | ^4.2.0   |
| `bcryptjs`                       | Password hashing                  | ^2.4.3   |
| `dayjs`                          | Date manipulation                 | ^1.11.13 |
| `sonner`                         | Toast notifications               | ^1.5.0   |

---

## Cấu Trúc Thư Mục

```
your-project/
├── lib/
│   ├── api/
│   │   ├── core.ts              # Core Axios service
│   │   └── services/            # API services
│   │       ├── authService.ts
│   │       ├── userService.ts
│   │       └── productService.ts
│   ├── redux/
│   │   ├── store.ts             # Redux store configuration
│   │   ├── hooks.ts             # Typed Redux hooks
│   │   └── slices/              # Redux slices
│   │       ├── authSlice.ts
│   │       ├── uiSlice.ts
│   │       └── cartSlice.ts
│   ├── providers/
│   │   ├── index.tsx            # Providers composition
│   │   ├── reduxProvider.tsx    # Redux Provider
│   │   └── queryProvider.tsx    # React Query setup
│   ├── utils/
│   │   ├── cn.ts                # Tailwind merge utility
│   │   ├── validators.ts        # Yup schemas
│   │   └── helpers.ts           # Common helpers
│   └── constants/
│       └── index.ts             # App constants
├── hooks/
│   ├── useAuth.ts               # Auth hooks
│   ├── useUser.ts               # User query hooks
│   ├── useProduct.ts            # Product query hooks
│   └── useForm.ts               # Custom form hooks
├── components/
│   ├── ui/                      # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── forms/                   # Form components
│   │   ├── LoginForm.tsx
│   │   └── ProductForm.tsx
│   ├── animations/              # Animated components
│   │   ├── PageTransition.tsx
│   │   └── ScrollReveal.tsx
│   └── layouts/                 # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
├── types/
│   ├── api.ts                   # API response types
│   ├── models.ts                # Data models
│   └── forms.ts                 # Form types
└── app/
    ├── globals.css              # Global styles + Tailwind
    ├── layout.tsx               # Root layout với providers
    └── ...                      # Pages

```

---

---

## UI & Styling Setup

### Tailwind CSS Configuration

#### 1. Cài đặt Tailwind CSS 4

```bash
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 2. Cấu hình `tailwind.config.ts`

```typescript
import type {Config} from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'},
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

#### 3. Update `app/globals.css`

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

#### 4. Create `lib/utils/cn.ts`

```typescript
import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Shadcn UI Integration

#### 1. Initialize Shadcn

```bash
npx shadcn@latest init
```

Chọn các options:

- ✅ TypeScript
- ✅ App Router
- ✅ Tailwind CSS
- Style: Default
- Base color: Slate
- CSS variables: Yes

#### 2. Add Components

```bash
# Core UI components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add toast
npx shadcn@latest add form

# Optional components
npx shadcn@latest add accordion
npx shadcn@latest add alert
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add checkbox
npx shadcn@latest add popover
npx shadcn@latest add separator
npx shadcn@latest add skeleton
npx shadcn@latest add table
npx shadcn@latest add tabs
```

#### 3. Example Usage

```typescript
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'

export function ExampleComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Example</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text..." />
        <Button className="mt-4">Submit</Button>
      </CardContent>
    </Card>
  )
}
```

### Iconify Setup

#### 1. Sử dụng Iconify

```typescript
import {Icon} from '@iconify/react'

export function IconExample() {
  return (
    <div>
      {/* Material Design Icons */}
      <Icon icon="mdi:home" width="24" height="24" />

      {/* Lucide Icons */}
      <Icon icon="lucide:user" className="w-6 h-6 text-primary" />

      {/* Font Awesome */}
      <Icon icon="fa6-solid:cart-shopping" width="20" />

      {/* Heroicons */}
      <Icon icon="heroicons:bell-20-solid" className="text-accent" />
    </div>
  )
}
```

#### 2. Icon Collections

Browse icons at: https://icon-sets.iconify.design/

Popular collections:

- `mdi:` - Material Design Icons
- `lucide:` - Lucide Icons
- `heroicons:` - Heroicons
- `fa6-solid:` - Font Awesome 6 Solid
- `ph:` - Phosphor Icons
- `tabler:` - Tabler Icons

#### 3. Dynamic Icon Loading

```typescript
import {Icon} from '@iconify/react'

interface DynamicIconProps {
  name: string
  size?: number
  className?: string
}

export function DynamicIcon({name, size = 24, className}: DynamicIconProps) {
  return <Icon icon={name} width={size} height={size} className={className} />
}
```

---

## Redux Toolkit Setup

### Store Configuration

#### 1. Create `lib/redux/store.ts`

```typescript
import {configureStore, combineReducers} from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage
import authSlice from './slices/authSlice'
import uiSlice from './slices/uiSlice'
import cartSlice from './slices/cartSlice'

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  ui: uiSlice,
  cart: cartSlice,
})

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'cart'], // Only persist auth and cart
  blacklist: ['ui'], // Don't persist UI state
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)

// Types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

#### 2. Create `lib/redux/hooks.ts`

```typescript
import {useDispatch, useSelector, useStore} from 'react-redux'
import type {RootState, AppDispatch} from './store'

// Typed hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<typeof import('./store').store>()
```

### Redux Persist

Redux Persist đã được tích hợp trong store configuration ở trên. State sẽ tự động persist vào localStorage.

### Creating Slices

#### 1. Auth Slice - `lib/redux/slices/authSlice.ts`

```typescript
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit'
import {setCookie, deleteCookie} from 'cookies-next'
import {jwtDecode} from 'jwt-decode'
import apiService from '@/lib/api/core'
import type {RootState} from '../store'

// Types
export interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (
    credentials: {email: string; password: string; rememberMe?: boolean},
    {rejectWithValue}
  ) => {
    try {
      const response = await apiService.post<{
        status: boolean
        data: {accessToken: string; user: User}
      }>('/auth/login', credentials)

      if (response.data.status && response.data.data.accessToken) {
        const token = response.data.data.accessToken
        const maxAge = credentials.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60

        setCookie('auth-token', token, {maxAge, path: '/'})
        apiService.setAuthToken(token)

        return {token, user: response.data.data.user}
      }

      return rejectWithValue('Login failed')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const logoutAsync = createAsyncThunk('auth/logout', async (_, {rejectWithValue}) => {
  try {
    await apiService.post('/auth/logout')
    deleteCookie('auth-token', {path: '/'})
    apiService.setAuthToken(null)
    return true
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiService.post<{
        status: boolean
        data: {accessToken: string}
      }>('/auth/refresh')

      if (response.data.status && response.data.data.accessToken) {
        const token = response.data.data.accessToken
        setCookie('auth-token', token, {maxAge: 24 * 60 * 60, path: '/'})
        apiService.setAuthToken(token)
        return token
      }

      return rejectWithValue('Refresh failed')
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{user: User; token: string}>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      apiService.setAuthToken(action.payload)

      try {
        const decoded = jwtDecode<User>(action.payload)
        state.user = decoded
        state.isAuthenticated = true
      } catch (error) {
        console.error('Failed to decode token:', error)
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      deleteCookie('auth-token', {path: '/'})
      apiService.setAuthToken(null)
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.isLoading = false
        state.error = null
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.isLoading = false
      })

    // Refresh Token
    builder
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.token = action.payload
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

// Actions
export const {setCredentials, setToken, logout, clearError} = authSlice.actions

// Selectors
export const selectAuth = (state: RootState) => state.auth
export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthToken = (state: RootState) => state.auth.token

export default authSlice.reducer
```

#### 2. UI Slice - `lib/redux/slices/uiSlice.ts`

```typescript
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '../store'

interface UiState {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  modalOpen: boolean
  loading: boolean
}

const initialState: UiState = {
  theme: 'system',
  sidebarOpen: false,
  modalOpen: false,
  loading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const {setTheme, toggleSidebar, setSidebarOpen, setModalOpen, setLoading} = uiSlice.actions

// Selectors
export const selectTheme = (state: RootState) => state.ui.theme
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen
export const selectModalOpen = (state: RootState) => state.ui.modalOpen
export const selectLoading = (state: RootState) => state.ui.loading

export default uiSlice.reducer
```

#### 3. Cart Slice - `lib/redux/slices/cartSlice.ts`

```typescript
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '../store'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartState {
  items: CartItem[]
  total: number
}

const initialState: CartState = {
  items: [],
  total: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }

      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    updateQuantity: (state, action: PayloadAction<{id: string; quantity: number}>) => {
      const item = state.items.find((item) => item.id === action.payload.id)

      if (item) {
        item.quantity = action.payload.quantity
        state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
    },
  },
})

export const {addToCart, removeFromCart, updateQuantity, clearCart} = cartSlice.actions

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartTotal = (state: RootState) => state.cart.total
export const selectCartItemCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0)

export default cartSlice.reducer
```

---

## API Layer Architecture

### Core API Service

### Core API Service

#### 1. Tạo `lib/api/core.ts`

```typescript
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import {deleteCookie} from 'cookies-next'
import {store} from '@/lib/redux/store'
import {logout} from '@/lib/redux/slices/authSlice'

export interface ApiError {
  code?: number
  message: string
  status: boolean
  data?: unknown
}

class ApiService {
  private client: AxiosInstance
  private authToken: string | null = null

  constructor(baseURL: string, timeout = 10000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token from Redux store
        const token = store.getState().auth.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Handle FormData - remove Content-Type to let browser set it with boundary
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type']
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    // Response Interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          deleteCookie('auth-token', {path: '/'})
          store.dispatch(logout())

          // Dispatch logout event for other tabs/windows
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('logout'))
          }
        }

        // Standardize error format
        const apiError: ApiError = {
          code: error.response?.status,
          message: error.response?.data?.message || error.message || 'Có lỗi xảy ra',
          status: false,
          data: error.response?.data,
        }

        return Promise.reject(apiError)
      }
    )
  }

  // Set auth token manually (for initial sync)
  setAuthToken(token: string | null) {
    this.authToken = token
  }

  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.client.request<T>(config)
    } catch (error) {
      throw error
    }
  }

  // GET with query params
  async get<T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params: params ? new URLSearchParams(params) : undefined,
    })
  }

  // POST
  async post<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
    })
  }

  // PUT
  async put<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
    })
  }

  // PATCH
  async patch<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
    })
  }

  // DELETE
  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
    })
  }

  // File upload with progress
  async upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentCompleted)
        }
      },
    })
  }
}

// Singleton instance
const apiService = new ApiService(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  600000 // 10 minutes timeout
)

export default apiService
```

### Service Layer Pattern

#### Pattern cho mỗi service file

**Template: `lib/api/services/exampleService.ts`**

```typescript
import apiService from '../core'

// ============================================
// 1. DEFINE TYPES & INTERFACES
// ============================================

export interface Example {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface ExampleListResponse {
  code: number
  status: boolean
  message: string
  data: {
    items: Example[]
    totalCount: number
    page: number
    pageSize: number
  }
}

export interface ExampleDetailResponse {
  code: number
  status: boolean
  message: string
  data: Example
}

export interface CreateExampleRequest {
  name: string
  description: string
}

export interface UpdateExampleRequest extends Partial<CreateExampleRequest> {
  id: string
}

export interface ExampleFilters {
  searchTerm?: string
  page?: number
  pageSize?: number
}

// ============================================
// 2. HELPER FUNCTIONS
// ============================================

const convertFilters = (filters?: ExampleFilters): Record<string, any> => {
  if (!filters) return {}

  const params: Record<string, any> = {}
  if (filters.searchTerm) params.searchTerm = filters.searchTerm
  if (filters.page !== undefined) params.page = filters.page
  if (filters.pageSize !== undefined) params.pageSize = filters.pageSize

  return params
}

// ============================================
// 3. SERVICE OBJECT
// ============================================

export const exampleService = {
  // GET list
  getExamples: async (filters?: ExampleFilters): Promise<ExampleListResponse> => {
    const params = convertFilters(filters)
    const response = await apiService.get<ExampleListResponse>('/api/examples', params)
    return response.data
  },

  // GET by ID
  getExample: async (id: string): Promise<ExampleDetailResponse> => {
    const response = await apiService.get<ExampleDetailResponse>(`/api/examples/${id}`)
    return response.data
  },

  // POST create
  createExample: async (data: CreateExampleRequest): Promise<ExampleDetailResponse> => {
    const response = await apiService.post<ExampleDetailResponse>('/api/examples', data)
    return response.data
  },

  // PUT update
  updateExample: async (data: UpdateExampleRequest): Promise<ExampleDetailResponse> => {
    const {id, ...updateData} = data
    const response = await apiService.put<ExampleDetailResponse>(`/api/examples/${id}`, updateData)
    return response.data
  },

  // DELETE
  deleteExample: async (id: string): Promise<{status: boolean; message: string}> => {
    const response = await apiService.delete(`/api/examples/${id}`)
    return response.data
  },
}

export default exampleService
```

#### Service với FormData (Upload)

```typescript
export const uploadService = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'uploads')

    const response = await apiService.upload<UploadResponse>('/api/upload', formData, (progress) =>
      console.log(`Upload progress: ${progress}%`)
    )

    return response.data
  },
}
```

### React Query Integration

#### 1. Custom Hooks Pattern

**Template: `hooks/useExample.ts`**

```typescript
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {toast} from 'sonner'
import {
  exampleService,
  type Example,
  type ExampleFilters,
  type CreateExampleRequest,
  type UpdateExampleRequest,
} from '@/lib/api/services/exampleService'

// ============================================
// QUERY HOOKS (GET operations)
// ============================================

export function useExamples(filters?: ExampleFilters) {
  const {data, isLoading, isError, error, refetch, isFetching} = useQuery({
    queryKey: ['examples', 'list', filters ? JSON.stringify(filters) : 'all'],
    queryFn: () => exampleService.getExamples(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes
    select: (response) => ({
      items: response.data?.items || [],
      totalCount: response.data?.totalCount || 0,
      page: response.data?.page || 1,
      pageSize: response.data?.pageSize || 10,
    }),
  })

  return {
    examples: data?.items || [],
    totalCount: data?.totalCount || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || 10,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  }
}

export function useExample(id?: string) {
  return useQuery({
    queryKey: ['examples', 'detail', id],
    queryFn: () => exampleService.getExample(id!),
    enabled: !!id, // Only run if id exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => response.data,
  })
}

// ============================================
// MUTATION HOOKS (POST/PUT/DELETE operations)
// ============================================

export function useCreateExample() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newExample: CreateExampleRequest) => exampleService.createExample(newExample),
    onSuccess: (response) => {
      if (response.status) {
        queryClient.invalidateQueries({queryKey: ['examples', 'list']})
        toast.success(response.message || 'Tạo thành công')
      } else {
        toast.error(response.message || 'Tạo thất bại')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra')
    },
  })
}

export function useUpdateExample() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updateData: UpdateExampleRequest) => exampleService.updateExample(updateData),
    onSuccess: (response, variables) => {
      if (response.status) {
        queryClient.invalidateQueries({queryKey: ['examples', 'list']})
        queryClient.invalidateQueries({queryKey: ['examples', 'detail', variables.id]})
        toast.success(response.message || 'Cập nhật thành công')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật thất bại')
    },
  })
}

export function useDeleteExample() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => exampleService.deleteExample(id),
    onSuccess: (response, deletedId) => {
      if (response.status) {
        queryClient.invalidateQueries({queryKey: ['examples', 'list']})
        queryClient.removeQueries({queryKey: ['examples', 'detail', deletedId]})
        toast.success(response.message || 'Xóa thành công')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa thất bại')
    },
  })
}
```

#### 2. Auth Hooks với Redux

**`hooks/useAuth.ts`**

```typescript
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'
import {useAppDispatch, useAppSelector} from '@/lib/redux/hooks'
import {loginAsync, logoutAsync, selectAuth} from '@/lib/redux/slices/authSlice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const auth = useAppSelector(selectAuth)

  const login = async (credentials: {email: string; password: string; rememberMe?: boolean}) => {
    try {
      const result = await dispatch(loginAsync(credentials)).unwrap()
      toast.success('Đăng nhập thành công')
      router.push('/dashboard')
      return result
    } catch (error: any) {
      toast.error(error || 'Đăng nhập thất bại')
      throw error
    }
  }

  const logout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap()
      toast.success('Đăng xuất thành công')
      router.push('/login')
    } catch (error: any) {
      toast.error('Có lỗi xảy ra')
    }
  }

  return {
    ...auth,
    login,
    logout,
  }
}
```

---

## Form Management

### Formik Setup

#### 1. Basic Formik Form

```typescript
'use client'

import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

interface LoginFormValues {
  email: string
  password: string
  rememberMe: boolean
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
})

export function LoginForm() {
  const initialValues: LoginFormValues = {
    email: '',
    password: '',
    rememberMe: false,
  }

  const handleSubmit = async (values: LoginFormValues) => {
    console.log(values)
    // Call login API
  }

  return (
    <Formik initialValues={initialValues} validationSchema={LoginSchema} onSubmit={handleSubmit}>
      {({errors, touched, isSubmitting}) => (
        <Form className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Field
              as={Input}
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              className={errors.email && touched.email ? 'border-red-500' : ''}
            />
            <ErrorMessage name="email" component="p" className="text-sm text-red-500 mt-1" />
          </div>

          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Field
              as={Input}
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className={errors.password && touched.password ? 'border-red-500' : ''}
            />
            <ErrorMessage name="password" component="p" className="text-sm text-red-500 mt-1" />
          </div>

          <div className="flex items-center">
            <Field id="rememberMe" name="rememberMe" type="checkbox" className="mr-2" />
            <Label htmlFor="rememberMe" className="cursor-pointer">
              Ghi nhớ đăng nhập
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </Form>
      )}
    </Formik>
  )
}
```

### Yup Validation

#### 1. Common Validation Schemas - `lib/utils/validators.ts`

```typescript
import * as Yup from 'yup'

// Email validation
export const emailSchema = Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email')

// Password validation
export const passwordSchema = Yup.string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .matches(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
  .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
  .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số')
  .required('Vui lòng nhập mật khẩu')

// Phone validation
export const phoneSchema = Yup.string()
  .matches(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số')
  .required('Vui lòng nhập số điện thoại')

// URL validation
export const urlSchema = Yup.string().url('URL không hợp lệ').required('Vui lòng nhập URL')

// Number range validation
export const priceSchema = Yup.number().min(0, 'Giá phải lớn hơn 0').required('Vui lòng nhập giá')

// File validation
export const imageSchema = Yup.mixed()
  .required('Vui lòng chọn ảnh')
  .test('fileSize', 'Kích thước file quá lớn (max 5MB)', (value: any) => {
    if (!value) return true
    return value.size <= 5 * 1024 * 1024
  })
  .test('fileType', 'Chỉ chấp nhận file ảnh', (value: any) => {
    if (!value) return true
    return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(value.type)
  })

// Login schema
export const LoginSchema = Yup.object().shape({
  email: emailSchema,
  password: Yup.string().required('Vui lòng nhập mật khẩu'),
  rememberMe: Yup.boolean(),
})

// Register schema
export const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự')
    .required('Vui lòng nhập tên'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
})

// Product schema
export const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự')
    .required('Vui lòng nhập tên sản phẩm'),
  description: Yup.string()
    .min(10, 'Mô tả phải có ít nhất 10 ký tự')
    .required('Vui lòng nhập mô tả'),
  price: priceSchema,
  category: Yup.string().required('Vui lòng chọn danh mục'),
  stock: Yup.number()
    .min(0, 'Số lượng phải lớn hơn hoặc bằng 0')
    .required('Vui lòng nhập số lượng'),
})
```

### Form Patterns

#### 1. Form với Shadcn UI Components

```typescript
'use client'

import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'

interface ProductFormValues {
  name: string
  description: string
  price: number
  category: string
  stock: number
}

const ProductSchema = Yup.object().shape({
  name: Yup.string().min(3).required('Vui lòng nhập tên sản phẩm'),
  description: Yup.string().min(10).required('Vui lòng nhập mô tả'),
  price: Yup.number().min(0).required('Vui lòng nhập giá'),
  category: Yup.string().required('Vui lòng chọn danh mục'),
  stock: Yup.number().min(0).required('Vui lòng nhập số lượng'),
})

export function ProductForm() {
  const initialValues: ProductFormValues = {
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
  }

  const handleSubmit = async (values: ProductFormValues) => {
    console.log(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm Sản Phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
        >
          {({errors, touched, setFieldValue, values, isSubmitting}) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="name">Tên sản phẩm</Label>
                <Field as={Input} id="name" name="name" placeholder="Nhập tên sản phẩm" />
                {errors.name && touched.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Nhập mô tả sản phẩm"
                  rows={4}
                />
                {errors.description && touched.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Giá</Label>
                  <Field as={Input} id="price" name="price" type="number" placeholder="0" />
                  {errors.price && touched.price && (
                    <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="stock">Số lượng</Label>
                  <Field as={Input} id="stock" name="stock" type="number" placeholder="0" />
                  {errors.stock && touched.stock && (
                    <p className="text-sm text-red-500 mt-1">{errors.stock}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="category">Danh mục</Label>
                <Select
                  value={values.category}
                  onValueChange={(value) => setFieldValue('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Điện tử</SelectItem>
                    <SelectItem value="fashion">Thời trang</SelectItem>
                    <SelectItem value="home">Gia dụng</SelectItem>
                    <SelectItem value="books">Sách</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && touched.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  )
}
```

#### 2. Form với File Upload

```typescript
'use client'

import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Icon} from '@iconify/react'

const ImageUploadSchema = Yup.object().shape({
  name: Yup.string().required('Vui lòng nhập tên'),
  image: Yup.mixed()
    .required('Vui lòng chọn ảnh')
    .test('fileSize', 'File quá lớn (max 5MB)', (value: any) => {
      return value && value.size <= 5 * 1024 * 1024
    })
    .test('fileType', 'Chỉ chấp nhận file ảnh', (value: any) => {
      return value && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(value.type)
    }),
})

export function ImageUploadForm() {
  const [preview, setPreview] = useState<string | null>(null)

  const handleSubmit = async (values: any) => {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('image', values.image)

    // Upload using apiService.upload()
    console.log('Uploading...', values)
  }

  return (
    <Formik
      initialValues={{name: '', image: null}}
      validationSchema={ImageUploadSchema}
      onSubmit={handleSubmit}
    >
      {({errors, touched, setFieldValue, isSubmitting}) => (
        <Form className="space-y-4">
          <div>
            <Label htmlFor="name">Tên</Label>
            <Field as={Input} id="name" name="name" placeholder="Nhập tên" />
            {errors.name && touched.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="image">Ảnh</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0]
                  if (file) {
                    setFieldValue('image', file)
                    setPreview(URL.createObjectURL(file))
                  }
                }}
              />
              <label htmlFor="image" className="cursor-pointer">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full h-48 mx-auto object-cover rounded"
                  />
                ) : (
                  <div className="py-8">
                    <Icon icon="lucide:upload-cloud" className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click để chọn ảnh</p>
                  </div>
                )}
              </label>
            </div>
            {errors.image && touched.image && (
              <p className="text-sm text-red-500 mt-1">{errors.image as string}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Đang upload...' : 'Upload'}
          </Button>
        </Form>
      )}
    </Formik>
  )
}
```

---

## Animation Setup

### Framer Motion

#### 1. Page Transitions

**`components/animations/PageTransition.tsx`**

```typescript
'use client'

import {motion, AnimatePresence} from 'framer-motion'
import {usePathname} from 'next/navigation'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
}

export function PageTransition({children}: {children: React.ReactNode}) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

#### 2. Scroll Reveal

**`components/animations/ScrollReveal.tsx`**

```typescript
'use client'

import {motion} from 'framer-motion'
import {useInView} from 'framer-motion'
import {useRef} from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function ScrollReveal({children, className, delay = 0}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, {once: true, amount: 0.3})

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{opacity: 0, y: 50}}
      animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 50}}
      transition={{duration: 0.6, delay, ease: 'easeOut'}}
    >
      {children}
    </motion.div>
  )
}
```

#### 3. Common Animations

```typescript
'use client'

import {motion} from 'framer-motion'

// Fade In
export const FadeIn = ({children}: {children: React.ReactNode}) => (
  <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5}}>
    {children}
  </motion.div>
)

// Scale Up
export const ScaleUp = ({children}: {children: React.ReactNode}) => (
  <motion.div
    initial={{scale: 0.8, opacity: 0}}
    animate={{scale: 1, opacity: 1}}
    transition={{duration: 0.3}}
  >
    {children}
  </motion.div>
)

// Slide In
export const SlideIn = ({
  children,
  direction = 'left',
}: {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
}) => {
  const directions = {
    left: {x: -100},
    right: {x: 100},
    up: {y: -100},
    down: {y: 100},
  }

  return (
    <motion.div
      initial={{...directions[direction], opacity: 0}}
      animate={{x: 0, y: 0, opacity: 1}}
      transition={{duration: 0.5}}
    >
      {children}
    </motion.div>
  )
}

// Stagger Children
export const StaggerContainer = ({children}: {children: React.ReactNode}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      visible: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    }}
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({children}: {children: React.ReactNode}) => (
  <motion.div
    variants={{
      hidden: {opacity: 0, y: 20},
      visible: {opacity: 1, y: 0},
    }}
  >
    {children}
  </motion.div>
)
```

### GSAP Integration

#### 1. Basic GSAP Animation

```typescript
'use client'

import {useEffect, useRef} from 'react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function GSAPExample() {
  const boxRef = useRef(null)

  useEffect(() => {
    const box = boxRef.current

    // Simple animation
    gsap.from(box, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    })

    // Scroll-triggered animation
    gsap.from(box, {
      scrollTrigger: {
        trigger: box,
        start: 'top 80%',
        end: 'top 50%',
        scrub: true,
      },
      scale: 0.8,
      opacity: 0,
    })
  }, [])

  return (
    <div ref={boxRef} className="w-32 h-32 bg-primary rounded-lg">
      Animated Box
    </div>
  )
}
```

#### 2. GSAP Timeline

```typescript
'use client'

import {useEffect, useRef} from 'react'
import gsap from 'gsap'

export function TimelineExample() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.from('.box1', {x: -100, opacity: 0, duration: 0.5})
        .from('.box2', {x: 100, opacity: 0, duration: 0.5}, '-=0.3')
        .from('.box3', {y: 50, opacity: 0, duration: 0.5}, '-=0.3')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="space-y-4">
      <div className="box1 w-32 h-32 bg-red-500 rounded-lg" />
      <div className="box2 w-32 h-32 bg-blue-500 rounded-lg" />
      <div className="box3 w-32 h-32 bg-green-500 rounded-lg" />
    </div>
  )
}
```

---

## Global Configuration

### 1. Redux Provider

**`lib/providers/reduxProvider.tsx`**

```typescript
'use client'

import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {store, persistor} from '@/lib/redux/store'

export function ReduxProvider({children}: {children: React.ReactNode}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
```

### 2. React Query Provider

**`lib/providers/queryProvider.tsx`**

```typescript
'use client'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {useState} from 'react'

export function QueryProvider({children}: {children: React.ReactNode}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 3 * 60 * 1000, // 3 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            retry: 1,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
```

### 3. Providers Composition

**`lib/providers/index.tsx`**

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

### 4. Root Layout Integration

**`app/layout.tsx`**

```typescript
import {Providers} from '@/lib/providers'
import type {Metadata} from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ecommerce App',
  description: 'Modern ecommerce application',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="vi">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### 5. Environment Variables

**`.env.local`**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# App Configuration
NEXT_PUBLIC_APP_NAME=Ecommerce App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Analytics, etc.
```

**`.env.production`**

```env
NEXT_PUBLIC_API_URL=https://api.yourapp.com
NEXT_PUBLIC_APP_NAME=Ecommerce App
NEXT_PUBLIC_APP_URL=https://yourapp.com
```

### 6. Middleware cho Protected Routes

**`middleware.ts`**

```typescript
import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const isAuthPage =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register')
  const isProtectedPage =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/profile')

  // Redirect to login if accessing protected page without token
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to dashboard if accessing auth page with token
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/register'],
}
```

---

## Development Workflow

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### ESLint Configuration

**`eslint.config.mjs`** (ESLint 9)

```javascript
import {dirname} from 'path'
import {fileURLToPath} from 'url'
import {FlatCompat} from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]

export default eslintConfig
```

### Prettier Configuration

**`.prettierrc`**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  "importOrder": [
    "^react",
    "^next",
    "<THIRD_PARTY_MODULES>",
    "^@/components/(.*)$",
    "^@/lib/(.*)$",
    "^@/hooks/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

---

## Best Practices

### 1. State Management Strategy

**Khi nào dùng Redux?**

- Global app state (auth, user, cart, theme)
- State cần persist giữa các sessions
- Complex state logic với nhiều actions
- State được chia sẻ giữa nhiều components

**Khi nào dùng React Query?**

- Server state (API data)
- Caching và invalidation
- Background refetching
- Optimistic updates

**Khi nào dùng useState/useReducer?**

- Local component state
- Form state (nếu không dùng Formik)
- UI state không cần share

### 2. API Service Patterns

```typescript
// Good - Structured service
export const userService = {
  getUsers: () => apiService.get('/users'),
  getUser: (id: string) => apiService.get(`/users/${id}`),
  createUser: (data) => apiService.post('/users', data),
}

// Bad - Mixed concerns
export const getUsers = () => axios.get('/users')
export const createUser = (data) => axios.post('/users', data)
```

### 3. Query Key Conventions

```typescript
// Good - Hierarchical and consistent
queryKey: ['users', 'list', {page: 1}]
queryKey: ['users', 'detail', userId]
queryKey: ['posts', 'list', {category: 'tech'}]

// Bad - Flat and inconsistent
queryKey: ['allUsers']
queryKey: ['userById', userId]
```

### 4. Form Validation Best Practices

```typescript
// Good - Reusable schemas
import {emailSchema, passwordSchema} from '@/lib/utils/validators'

const LoginSchema = Yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
})

// Bad - Duplicate validation logic
const LoginSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
})
```

### 5. Component Organization

```
components/
├── ui/              # Shadcn components (atomic)
├── forms/           # Form components with logic
├── layouts/         # Layout wrappers
├── animations/      # Reusable animated components
└── features/        # Feature-specific components
    ├── auth/
    ├── products/
    └── cart/
```

### 6. TypeScript Best Practices

```typescript
// Good - Export types from services
export type {User, UserResponse, CreateUserRequest}

// Good - Use Pick/Omit for derived types
export type UpdateUserRequest = Omit<CreateUserRequest, 'password'>

// Good - Generic API response
export interface ApiResponse<T> {
  code: number
  status: boolean
  message: string
  data: T
}
```

### 7. Performance Optimization

```typescript
// Lazy load heavy components
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false,
})

// Memoize expensive computations
const sortedItems = useMemo(() => items.sort((a, b) => a.price - b.price), [items])

// Debounce search inputs
import {useDebouncedCallback} from 'use-debounce'

const handleSearch = useDebouncedCallback((value) => {
  refetch({search: value})
}, 500)
```

### 8. Error Handling Strategy

```typescript
// 1. Global error handling (API interceptor) ✅
// 2. Hook-level error handling
const {mutate} = useCreateProduct({
  onError: (error) => {
    if (error.code === 409) {
      setDuplicateError(true)
    }
  },
})

// 3. Component-level error boundaries
;<ErrorBoundary fallback={<ErrorPage />}>
  <YourComponent />
</ErrorBoundary>
```

### 9. Testing Strategy

```typescript
// Unit tests - Redux slices, utilities
test('authSlice logout', () => {
  const state = authSlice(initialState, logout())
  expect(state.user).toBeNull()
})

// Integration tests - Hooks with React Query
test('useUsers fetches users', async () => {
  const {result} = renderHook(() => useUsers(), {
    wrapper: createWrapper(),
  })
  await waitFor(() => expect(result.current.users).toHaveLength(5))
})

// E2E tests - User flows
test('user can login', async () => {
  render(<LoginPage />)
  fireEvent.change(screen.getByLabelText('Email'), {
    target: {value: 'test@example.com'},
  })
  // ...
})
```

### 10. Security Best Practices

- ✅ Never commit `.env.local` files
- ✅ Validate all user inputs (Yup schemas)
- ✅ Sanitize data before API calls
- ✅ Use HTTPS in production
- ✅ Implement CSRF protection
- ✅ Rate limiting on API routes
- ✅ Secure cookie flags (`httpOnly`, `secure`, `sameSite`)

---

## Troubleshooting

### Common Issues

#### 1. "Hydration mismatch with Redux"

```typescript
// Solution: Wait for client-side hydration
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) return null
```

#### 2. "Redux Persist not working"

```typescript
// Solution: Check PersistGate in providers
<PersistGate loading={null} persistor={persistor}>
  {children}
</PersistGate>
```

#### 3. "Query data not updating"

```typescript
// Solution: Invalidate queries properly
queryClient.invalidateQueries({queryKey: ['users']})
```

#### 4. "Formik values not updating"

```typescript
// Solution: Use setFieldValue for controlled components
<Select value={values.category} onValueChange={(value) => setFieldValue('category', value)} />
```

#### 5. "GSAP animations not working in Next.js"

```typescript
// Solution: Use useEffect and gsap.context
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from('.box', {x: -100})
  }, containerRef)

  return () => ctx.revert() // Cleanup
}, [])
```

---

## Migration Checklist

- [ ] Install all dependencies
- [ ] Configure Tailwind CSS 4
- [ ] Initialize Shadcn UI
- [ ] Create Redux store và slices
- [ ] Setup Redux Persist
- [ ] Create `lib/api/core.ts`
- [ ] Create service files
- [ ] Create custom hooks (useAuth, useUser, etc.)
- [ ] Setup providers (Redux, Query, Toaster)
- [ ] Update `app/layout.tsx`
- [ ] Create form components with Formik
- [ ] Add validation schemas
- [ ] Setup animations (Framer Motion/GSAP)
- [ ] Configure environment variables
- [ ] Setup middleware for protected routes
- [ ] Add ESLint và Prettier configs
- [ ] Test authentication flow
- [ ] Test API calls with DevTools
- [ ] Setup error boundaries

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Formik](https://formik.org/)
- [Yup](https://github.com/jquense/yup)
- [Framer Motion](https://www.framer.com/motion/)
- [GSAP](https://gsap.com/)
- [Iconify](https://iconify.design/)

---

**Version**: 2.0.0  
**Last Updated**: December 2025  
**Architecture**: Next.js 16+ App Router + TypeScript + Redux Toolkit

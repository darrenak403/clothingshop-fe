---
name: nextjs-react-rules
description: Next.js & React Best Practices and Coding Standards for E-Commerce Frontend
---

# Next.js & React Best Practices Rules

## Overview

Best practices and coding standards for Next.js 16 and React 19 development in the E-Commerce Frontend project. Follow these rules to maintain consistency, security, and code quality across all features.

---

## 1. Project Architecture

### Tech Stack Overview

- **Next.js** `16.0.10` with App Router (not Pages Router)
- **React** `19.2.1` with Server Components by default
- **TypeScript** `^5` with strict mode enabled
- **State Management:** Redux Toolkit `^2.11.2` (global state) + React Query `^5.90.12` (server state)
- **UI Framework:** TailwindCSS `^4.1.18` + shadcn/ui (Radix UI components)
- **Form Handling:** React Hook Form `^7.71.1` + Zod `^4.3.5` validation
- **Authentication:** JWT tokens with automatic refresh, stored in httpOnly cookies

### Core Principles

- Server Components by default, Client Components only when necessary
- TypeScript strict mode always enabled, no implicit any
- Mobile-first responsive design using Tailwind CSS
- Accessibility (A11Y) compliance for all interactive elements
- Security-first approach: never hardcode secrets, validate all inputs

---

## 2. Component Architecture

### Server vs Client Components

- **Default to Server Components** for better performance and SEO
- Use `"use client"` directive only when component needs:
  - React hooks (useState, useEffect, useContext, etc.)
  - Event handlers (onClick, onChange, onSubmit, etc.)
  - Browser APIs (window, localStorage, document, etc.)
  - Third-party libraries that require client-side execution
- Never add "use client" unnecessarily as it increases bundle size

### Component Structure Pattern

```typescript
// 1. Import statements (React, third-party, local)
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/models";

// 2. Type definitions
interface ComponentProps {
  user: User;
  onUpdate: (id: string) => void;
}

// 3. Component definition
export function ComponentName({ user, onUpdate }: ComponentProps) {
  // 3.1. Hooks (state, effects, custom hooks)
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useQuery({ queryKey: ["key"], queryFn: fetchData });

  // 3.2. Event handlers
  const handleClick = () => {
    onUpdate(user.id);
  };

  // 3.3. Render
  return <div>Component JSX</div>;
}
```

### File Naming Conventions

- Components: PascalCase (e.g., `ProductCard.tsx`, `UserProfile.tsx`)
- Utilities/hooks: camelCase (e.g., `useAuth.ts`, `formatPrice.ts`)
- API services: camelCase with "Service" suffix (e.g., `authService.ts`, `productService.ts`)
- Page files: lowercase (e.g., `page.tsx`, `layout.tsx`, `not-found.tsx`)
- Route folders: kebab-case for routes (e.g., `sign-in/`, `forgot-password/`)

---

## 3. TypeScript Standards

### Type Safety Rules

- Always enable strict mode in tsconfig.json (no implicit any)
- Provide explicit type annotations for all function parameters and return types
- Never use `any` type - use `unknown` if type is truly unknown, then type guard
- Use `type` for unions/intersections, `interface` for object shapes
- Use type-only imports: `import type { User } from "@/types/models"`

### Type Definition Examples

```typescript
// Good: Explicit types
interface UserCardProps {
  user: User;
  onEdit: (userId: string) => void;
}

export function UserCard({ user, onEdit }: UserCardProps): JSX.Element {
  // Implementation
}

// Bad: Implicit any
export function UserCard(props) {
  // ❌ No types
  // Implementation
}
```

### Type Organization

- Define shared types in `types/` folder (models.ts, api.ts)
- Keep component-specific types in same file as component
- Export types that are used across multiple files
- Use discriminated unions for different states/variants

---

## 4. State Management Strategy

### Redux Toolkit (Global State)

- Use Redux only for truly global state that needs persistence
- Appropriate use cases:
  - Authentication state (user, tokens, isAuthenticated)
  - User profile data
  - Shopping cart (if persisting across sessions)
  - Global UI state (theme, locale, sidebar state)
- Register slices in store.ts and persist using redux-persist

### Redux Toolkit Patterns

```typescript
// Always use createAsyncThunk for async operations
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Use typed hooks from lib/redux/hooks
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

// In component
const dispatch = useAppDispatch();
const user = useAppSelector((state) => state.auth.user);
```

### React Query (Server State)

- Use React Query for all API data fetching and mutations
- Appropriate use cases:
  - Fetching products, orders, user data from API
  - Caching server responses
  - Background refetching and invalidation
  - Mutations (POST, PUT, DELETE operations)
- Never store server data in Redux

### React Query Patterns

```typescript
// Queries - for fetching data
const { data, isLoading, error } = useQuery({
  queryKey: ["products", category, page],
  queryFn: () => productService.getProducts({ category, page }),
  staleTime: 5 * 60 * 1000, // 5 minutes
  retry: 3,
});

// Mutations - for creating/updating data
const mutation = useMutation({
  mutationFn: (product: Product) => productService.createProduct(product),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    toast.success("Product created successfully");
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

### Local State (useState)

- Use useState for component-specific UI state only
- Appropriate use cases:
  - Modal open/closed state
  - Form input values (with React Hook Form)
  - Toggle states, loading indicators
  - Temporary UI state that doesn't need persistence
- Never use useState for data that should be in Redux or React Query

---

## 5. Form Handling & Validation

### React Hook Form Pattern

- Always use React Hook Form for all forms (no manual state management)
- Integrate with Zod for schema validation (preferred over Yup)
- Use shadcn/ui Form components for consistent styling
- Handle loading, error, and success states properly

### Complete Form Example

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 1. Define Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// 2. Component
export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await authService.login(data);
      toast.success("Login successful");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Loading..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
```

### Validation Best Practices

- Always provide user-friendly error messages
- Validate on blur for better UX, not on every keystroke
- Show loading state during submission
- Disable submit button while form is submitting
- Clear form after successful submission if appropriate

---

## 6. API Integration & Services

### API Service Layer Structure

- Create service files in `lib/api/services/` (e.g., authService.ts, productService.ts)
- Export service class or object with methods
- Use Axios instance from `lib/api/core.ts` with interceptors
- Never make direct API calls from components

### Service Pattern

```typescript
// lib/api/services/productService.ts
import apiClient from "../core";
import type { Product, ApiResponse } from "@/types";

export interface GetProductsParams {
  category?: string;
  page?: number;
  limit?: number;
}

class ProductService {
  async getProducts(params: GetProductsParams): Promise<ApiResponse<Product[]>> {
    const response = await apiClient.get<ApiResponse<Product[]>>("/products", { params });
    return response.data;
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  }

  async createProduct(product: Product): Promise<ApiResponse<Product>> {
    const response = await apiClient.post<ApiResponse<Product>>("/products", product);
    return response.data;
  }
}

export default new ProductService();
```

### Axios Interceptor Pattern

```typescript
// lib/api/core.ts
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use((config) => {
  const token = getCookie("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie("refresh-token");
        const { data } = await axios.post("/auth/refresh", { refreshToken });
        setCookie("auth-token", data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = "/sign-in";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 7. Routing & Navigation

### App Router Structure

- Use Next.js 16 App Router (not Pages Router)
- Organize routes using route groups for layout control:
  - `(auth)/` - Authentication pages without main layout
  - `(user)/` - User-facing pages with header/footer
  - `(system)/` - Admin/Staff dashboards with sidebar
- Use `page.tsx` for route content, `layout.tsx` for shared layouts

### Route Protection Pattern

```typescript
// middleware.ts - Global middleware for auth
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/user")) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    try {
      const decoded = jwtDecode(token);
      // Check role-based access
      if (pathname.startsWith("/admin") && decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/staff/:path*"],
};
```

### Navigation Best Practices

- Use Next.js Link component for internal navigation
- Use useRouter() hook for programmatic navigation
- Never use window.location for internal routes
- Prefetch important routes using Link's prefetch prop

---

## 8. Styling with Tailwind CSS

### Utility-First Approach

- Use Tailwind utility classes directly in JSX
- Use `cn()` utility from `lib/utils.ts` to merge class names
- Never write custom CSS unless absolutely necessary
- Use Tailwind's responsive modifiers (sm:, md:, lg:, xl:)

### Styling Patterns

```typescript
import { cn } from "@/lib/utils";

// Good: Using cn() for conditional classes
<Button
  className={cn(
    "px-4 py-2 rounded-md",
    isPrimary && "bg-blue-500 text-white",
    isDisabled && "opacity-50 cursor-not-allowed"
  )}
/>

// Good: Responsive design mobile-first
<div className="flex flex-col md:flex-row gap-4 p-4 md:p-6">
  <div className="w-full md:w-1/2">Content</div>
</div>

// Good: Dark mode support
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  Content
</div>
```

### shadcn/ui Components

- Always use shadcn/ui components instead of building custom UI
- Available components: Button, Input, Card, Dialog, DropdownMenu, Table, Form, etc.
- Customize shadcn components using className props and Tailwind
- Never modify component source files directly

---

## 9. Security Best Practices

### Authentication & Authorization

- Store JWT tokens in httpOnly cookies, never in localStorage
- Implement automatic token refresh before expiration
- Validate authentication state on server-side (middleware)
- Check user roles/permissions before rendering protected content
- Always logout by clearing cookies and Redux state

### Input Validation & Sanitization

- Validate all user inputs using Zod schemas before API calls
- Sanitize user-generated content before displaying
- Never trust client-side validation alone - always validate on server
- Use type guards to validate runtime data shapes

### Environment Variables

- Store API URLs and public keys in .env.local file
- Use `NEXT_PUBLIC_` prefix only for truly public variables
- Never commit .env files to source control
- Keep sensitive keys server-side only (without NEXT*PUBLIC*)

### Security Checklist

```typescript
// ❌ Bad: Storing tokens in localStorage
localStorage.setItem("token", accessToken);

// ✅ Good: Storing in httpOnly cookies
setCookie("auth-token", accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60, // 7 days
});

// ❌ Bad: Hardcoded API key
const API_KEY = "sk_test_12345";

// ✅ Good: Environment variable
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// ❌ Bad: No input validation
const handleSubmit = (email: string) => {
  api.post("/register", { email });
};

// ✅ Good: Zod validation
const schema = z.object({ email: z.string().email() });
const handleSubmit = (data: unknown) => {
  const validated = schema.parse(data);
  api.post("/register", validated);
};
```

---

## 10. Error Handling

### Component-Level Error Handling

- Always wrap async operations in try-catch blocks
- Show user-friendly error messages using toast notifications
- Log errors with context for debugging
- Handle loading and error states in UI

### Error Handling Pattern

```typescript
import { toast } from "sonner";

const handleSubmit = async (data: FormData) => {
  try {
    setIsLoading(true);
    const response = await productService.createProduct(data);

    if (response.success) {
      toast.success(response.message || "Product created successfully");
      router.push("/products");
    } else {
      toast.error(response.message || "Failed to create product");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    toast.error(message);
    console.error("Error creating product:", error);
  } finally {
    setIsLoading(false);
  }
};
```

### React Query Error Handling

```typescript
const { data, error, isError } = useQuery({
  queryKey: ["products"],
  queryFn: productService.getProducts,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

if (isError) {
  return (
    <div className="p-4 bg-red-50 text-red-600 rounded-md">
      Error loading products: {error.message}
    </div>
  );
}
```

### Redux Error Handling

```typescript
// In slice
extraReducers: (builder) => {
  builder
    .addCase(loginAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(loginAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    })
    .addCase(loginAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });
};
```

---

## 11. Async Patterns

### Always Use Async/Await

- Use async/await for all I/O operations: API calls, file operations, database
- Return Task/Promise from async functions
- Never use .Result or .Wait() as they cause deadlocks
- Use try-catch for error handling in async functions

### Async Best Practices

```typescript
// ✅ Good: Proper async/await
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get<ApiResponse<Product[]>>("/products");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// ❌ Bad: Not awaiting promise
export function getProducts(): Promise<Product[]> {
  return apiClient.get("/products").data.data; // Won't work
}

// ❌ Bad: Using .then() chains
export function getProducts(): Promise<Product[]> {
  return apiClient
    .get("/products")
    .then((response) => response.data.data)
    .catch((error) => console.error(error));
}
```

### Parallel Async Operations

```typescript
// ✅ Good: Parallel execution with Promise.all
const [products, categories, featured] = await Promise.all([
  productService.getProducts(),
  productService.getCategories(),
  productService.getFeatured(),
]);

// ❌ Bad: Sequential execution (slower)
const products = await productService.getProducts();
const categories = await productService.getCategories();
const featured = await productService.getFeatured();
```

---

## 12. Performance Optimization

### Next.js Optimization

- Use Next.js Image component for all images (automatic optimization)
- Implement lazy loading for heavy components using dynamic imports
- Use React.memo() for expensive pure components
- Optimize bundle size - check what libraries you're importing

### Image Optimization

```typescript
import Image from "next/image";

// ✅ Good: Using Next.js Image
<Image
  src="/product.jpg"
  alt="Product"
  width={500}
  height={500}
  priority // for above-the-fold images
  placeholder="blur"
/>

// ❌ Bad: Regular img tag
<img src="/product.jpg" alt="Product" />
```

### Code Splitting

```typescript
import dynamic from "next/dynamic";

// ✅ Good: Dynamic import for heavy component
const HeavyChart = dynamic(() => import("./HeavyChart"), {
  loading: () => <Skeleton />,
  ssr: false, // disable SSR if not needed
});

// Use React.memo for expensive renders
export const ProductCard = React.memo(function ProductCard({ product }: Props) {
  return <div>{/* Complex rendering */}</div>;
});
```

### React Query Caching

```typescript
// Configure stale time and cache time appropriately
const { data } = useQuery({
  queryKey: ["products", category],
  queryFn: () => productService.getProducts({ category }),
  staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
  cacheTime: 10 * 60 * 1000, // 10 minutes - keep in cache
  refetchOnWindowFocus: false, // don't refetch on window focus
});
```

---

## 13. Accessibility (A11Y)

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Use proper tab order (tabIndex when necessary)
- Handle keyboard events (Enter, Escape, Arrow keys)
- Provide visible focus indicators

### Semantic HTML

- Use semantic HTML elements: `<button>`, `<nav>`, `<main>`, `<article>`, `<section>`
- Never use `<div>` with onClick - use `<button>` instead
- Use heading hierarchy properly (h1 → h2 → h3)
- Use labels for all form inputs

### ARIA Labels

```typescript
// ✅ Good: Proper accessibility
<button
  onClick={handleClose}
  aria-label="Close dialog"
  aria-pressed={isOpen}
>
  <Icon name="close" aria-hidden="true" />
</button>

<input
  type="text"
  id="search"
  aria-describedby="search-help"
  aria-required="true"
/>
<span id="search-help">Enter product name or category</span>

// Use alt text for images
<Image src="/product.jpg" alt="Blue running shoes" />

// ❌ Bad: No accessibility
<div onClick={handleClose}>
  <Icon name="close" />
</div>
```

---

## 14. Code Organization

### Project Structure

```
app/
├── (auth)/                  # Public auth pages
│   ├── sign-in/page.tsx
│   └── sign-up/page.tsx
├── (user)/                  # User pages with layout
│   ├── products/page.tsx
│   └── profile/page.tsx
├── (system)/                # Admin/Staff dashboards
│   ├── admin/dashboard/page.tsx
│   └── staff/dashboard/page.tsx
├── layout.tsx               # Root layout
└── page.tsx                 # Homepage

components/
├── ui/                      # shadcn/ui components
├── shared/                  # Shared components (Header, Footer)
└── modules/                 # Feature-specific components

lib/
├── api/
│   ├── core.ts             # Axios instance
│   └── services/           # API service layer
├── redux/
│   ├── store.ts
│   └── slices/
├── providers/              # React context providers
└── utils.ts                # Utility functions

types/
├── models.ts               # Domain models
└── api.ts                  # API response types

hooks/
└── useAuth.ts              # Custom hooks
```

### Import Organization

```typescript
// 1. React & Next.js
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

// 2. Third-party libraries
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 3. UI components (shadcn/ui)
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

// 4. Local components
import { Header } from "@/components/shared/Header";
import { ProductCard } from "@/components/modules/ProductCard";

// 5. Hooks & utilities
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { cn, formatPrice } from "@/lib/utils";

// 6. Services
import productService from "@/lib/api/services/productService";

// 7. Types
import type { Product, User } from "@/types/models";
import type { ApiResponse } from "@/types/api";

// 8. Assets
import Logo from "@/public/logo.svg";
```

---

## Quick Reference

### Common Patterns

```typescript
// API Response Pattern
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Service Method
async getProducts(): Promise<ApiResponse<Product[]>> {
  const response = await apiClient.get("/products");
  return response.data;
}

// React Query
const { data, isLoading } = useQuery({
  queryKey: ["products"],
  queryFn: productService.getProducts,
});

// Form with Zod
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Redux Async Thunk
export const fetchUser = createAsyncThunk(
  "user/fetch",
  async (id: string, { rejectWithValue }) => {
    try {
      return await userService.getById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Protected Route
if (!isAuthenticated) {
  redirect("/sign-in");
}

// Toast Notifications
toast.success("Action completed!");
toast.error("Something went wrong");
```

### NPM Scripts

```bash
npm run dev           # Start dev server (port 8989)
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint errors
npm run format        # Format with Prettier
npm run type-check    # TypeScript check
npm run validate      # Run all checks + build
```

---

## Checklist

Before submitting code, ensure:

### Architecture & Structure

- [ ] Using Server Components by default, "use client" only when necessary
- [ ] Following proper folder structure (app/, components/, lib/, types/)
- [ ] Components are small, focused, single-responsibility
- [ ] Proper separation of concerns (UI, business logic, API calls)

### TypeScript

- [ ] Strict mode enabled, no implicit any types
- [ ] All functions have explicit parameter and return types
- [ ] Using type vs interface appropriately
- [ ] Type-only imports for types (`import type`)

### State Management

- [ ] Redux used only for global persistent state
- [ ] React Query used for all server state/API calls
- [ ] useState used only for local component UI state
- [ ] No server data stored in Redux

### Forms & Validation

- [ ] Using React Hook Form for all forms
- [ ] Zod schemas for validation (not Yup)
- [ ] Integrated with shadcn/ui Form components
- [ ] Proper loading and error states

### API Integration

- [ ] API calls in service layer, not directly in components
- [ ] Using Axios instance from core.ts with interceptors
- [ ] Proper error handling with try-catch
- [ ] Type-safe API calls with TypeScript

### Security

- [ ] No hardcoded secrets or API keys
- [ ] JWT tokens stored in httpOnly cookies
- [ ] Input validation with Zod before API calls
- [ ] Route protection with middleware
- [ ] Environment variables in .env.local

### Styling

- [ ] Using Tailwind CSS utility classes
- [ ] Using cn() utility for conditional classes
- [ ] Using shadcn/ui components (not custom UI)
- [ ] Mobile-first responsive design
- [ ] Dark mode support where applicable

### Performance

- [ ] Using Next.js Image for all images
- [ ] Dynamic imports for heavy components
- [ ] React.memo() for expensive renders
- [ ] Proper React Query caching configuration

### Accessibility

- [ ] Keyboard navigation works properly
- [ ] Semantic HTML elements used
- [ ] ARIA labels on interactive elements
- [ ] Alt text on all images
- [ ] Proper heading hierarchy

### Error Handling

- [ ] Try-catch blocks around all async operations
- [ ] User-friendly error messages with toast
- [ ] Errors logged with context for debugging
- [ ] Loading and error states in UI

### Code Quality

- [ ] Proper import organization (React → 3rd party → local)
- [ ] Consistent naming conventions (PascalCase, camelCase)
- [ ] No unused imports or variables
- [ ] No console.log statements (except errors/warns)
- [ ] Code formatted with Prettier
- [ ] ESLint passes with no errors
- [ ] TypeScript compiles with no errors

### Git

- [ ] Conventional commit message format
- [ ] Husky pre-commit hooks pass
- [ ] No sensitive data in commits
- [ ] .env files in .gitignore

---

**Last Updated:** January 19, 2026
**Next.js Version:** 16.0.10
**React Version:** 19.2.1
**TypeScript Version:** ^5

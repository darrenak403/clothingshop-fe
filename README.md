# Ecommerce Frontend

Modern ecommerce application built with Next.js 16 + Redux Toolkit + React Query

## Tech Stack

- **Next.js 16** - React framework
- **Redux Toolkit** - State management
- **TanStack React Query** - Server state
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Formik + Yup** - Forms & validation
- **Framer Motion** - Animations

## Quick Start

```bash
# Install dependencies
npm install

# Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Ecommerce App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/                # Next.js App Router
lib/
  api/             # ✅ API services (axios + interceptors)
  redux/           # ✅ Redux store + auth slice
  providers/       # ✅ React providers
  utils/           # ✅ Utilities + validators
  constants/       # ✅ App constants
hooks/             # ✅ Custom hooks (useAuth)
types/             # ✅ TypeScript types
middleware.ts      # ✅ Protected routes
```

## Features

✅ **Authentication:**

- Login/Register với Redux Toolkit
- JWT token trong cookies
- Protected routes middleware
- Auto redirect on 401 errors

✅ **API Layer:**

- Axios service với interceptors
- Auto token injection
- Error handling
- File mẫu: `lib/api/services/productService.ts`

✅ **State Management:**

- Redux Toolkit + Redux Persist
- React Query cho server state
- Typed hooks

## Available Scripts

```bash
npm run dev          # Development với Turbopack
npm run build        # Build production
npm start            # Start production server
npm run lint         # Lint code
npm run lint:fix     # Fix lint errors
npm run type-check   # TypeScript check
npm run format       # Format code
```

## Documentation

📚 Xem [SETUP.md](./SETUP.md) để biết chi tiết setup và architecture

## Next Steps

- [ ] Tạo trang Login (`app/login/page.tsx`)
- [ ] Tạo trang Register (`app/register/page.tsx`)
- [ ] Tạo trang Dashboard (`app/dashboard/page.tsx`)
- [ ] Tạo UI components (Button, Input, Card...)
- [ ] Tạo thêm API services theo mẫu `productService.ts`

---

**Built with ❤️ using Next.js 16 + Modern Stack**

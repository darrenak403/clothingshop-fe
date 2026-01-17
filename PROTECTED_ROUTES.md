# Protected Routes Documentation

## Tổng quan

Hệ thống bảo vệ route dựa trên vai trò người dùng (role-based access control).

## Các Role trong hệ thống

| Role ID | Role Name | Mô tả                                        |
| ------- | --------- | -------------------------------------------- |
| 1       | Admin     | Quản trị viên - Quyền cao nhất               |
| 2       | Staff     | Nhân viên - Quyền quản lý sản phẩm, đơn hàng |
| 3       | Customer  | Khách hàng - Quyền mua sắm cơ bản            |

## Components

### 1. ProtectedRoute

Bảo vệ route yêu cầu đăng nhập, có thể kiểm tra nhiều role.

**Cách sử dụng:**

```tsx
import ProtectedRoute from "@/components/auth/ProtectedRoute";

<ProtectedRoute allowedRoles={["Admin", "Staff"]}>
  <YourComponent />
</ProtectedRoute>;
```

**Props:**

- `children`: React.ReactNode - Nội dung cần bảo vệ
- `allowedRoles`: string[] (optional) - Danh sách role được phép truy cập
- `redirectTo`: string (optional, default: "/sign-in") - URL redirect khi không có quyền

### 2. RoleBasedRoute

Bảo vệ route chỉ cho phép một role cụ thể.

**Cách sử dụng:**

```tsx
import RoleBasedRoute from "@/components/auth/RoleBasedRoute";

<RoleBasedRoute requiredRole="Admin">
  <AdminDashboard />
</RoleBasedRoute>;
```

**Props:**

- `children`: React.ReactNode - Nội dung cần bảo vệ
- `requiredRole`: "Admin" | "Staff" | "Customer" - Role được yêu cầu

## Routes được bảo vệ

### Admin Routes

- `/admin/dashboard` - Chỉ Admin

### Staff Routes

- `/staff/dashboard` - Chỉ Staff

### Customer Routes

- `/profile` - Tất cả user đã đăng nhập
- `/orders` - Tất cả user đã đăng nhập
- `/cart` - Tất cả user đã đăng nhập

## Redirect Logic

Khi người dùng đăng nhập thành công, hệ thống sẽ redirect dựa trên role:

```
Admin → /admin/dashboard
Staff → /staff/dashboard
Customer → / (homepage)
```

Khi người dùng truy cập route không có quyền:

- Nếu chưa đăng nhập → `/sign-in`
- Nếu đã đăng nhập nhưng sai role → Redirect về dashboard phù hợp với role của họ

## Ví dụ sử dụng

### Bảo vệ một trang admin:

```tsx
// app/admin/users/page.tsx
import RoleBasedRoute from "@/components/auth/RoleBasedRoute";

export default function AdminUsersPage() {
  return (
    <RoleBasedRoute requiredRole="Admin">
      <div>Quản lý người dùng</div>
    </RoleBasedRoute>
  );
}
```

### Bảo vệ trang cho cả Admin và Staff:

```tsx
// app/products/manage/page.tsx
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ManageProductsPage() {
  return (
    <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
      <div>Quản lý sản phẩm</div>
    </ProtectedRoute>
  );
}
```

### Bảo vệ trang yêu cầu đăng nhập (mọi role):

```tsx
// app/profile/page.tsx
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div>Thông tin cá nhân</div>
    </ProtectedRoute>
  );
}
```

## Constants

File `lib/constants/roles.ts` chứa các hằng số và helper functions:

```typescript
import { ROLES, getRoleNameById, getRoleIdByName } from "@/lib/constants/roles";

// Sử dụng
const roleName = getRoleNameById(1); // "Admin"
const roleId = getRoleIdByName("Admin"); // 1
```

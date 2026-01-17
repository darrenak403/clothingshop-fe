"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      // Chỉ kiểm tra cho các route admin và staff
      if (pathname.startsWith("/admin")) {
        if (!isAuthenticated) {
          router.push("/sign-in");
          return;
        }
        if (user?.role !== "Admin") {
          // Redirect về trang phù hợp với role
          if (user?.role === "Staff") {
            router.push("/staff/dashboard");
          } else {
            router.push("/");
          }
          return;
        }
      } else if (pathname.startsWith("/staff")) {
        if (!isAuthenticated) {
          router.push("/sign-in");
          return;
        }
        if (user?.role !== "Staff") {
          // Redirect về trang phù hợp với role
          if (user?.role === "Admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/");
          }
          return;
        }
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [pathname, isAuthenticated, user, router]);

  // Hiển thị loading khi đang kiểm tra admin/staff routes
  if (isChecking && (pathname.startsWith("/admin") || pathname.startsWith("/staff"))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

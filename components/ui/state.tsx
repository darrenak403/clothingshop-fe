"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  detail?: string;
  onRetry?: () => void;
}

function ErrorState({ className, message, detail, onRetry, ...props }: ErrorStateProps) {
  return (
    <div
      className={cn("min-h-screen bg-gray-50 flex items-center justify-center", className)}
      {...props}
    >
      <Card className="max-w-md mx-auto text-center shadow-md">
        <CardContent className="p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{message || "Có lỗi xảy ra"}</h2>
          {detail && <p className="text-gray-600 mb-6">{detail}</p>}
          <div className="flex gap-4 justify-center">
            {onRetry && (
              <Button onClick={onRetry} variant="default">
                Thử lại
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href="/">Về trang chủ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("min-h-screen bg-gray-50 flex items-center justify-center", className)}
      {...props}
    >
      <Card className="max-w-sm w-full mx-auto text-center shadow-md">
        <CardContent className="p-8">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy dữ liệu</h2>
          <p className="text-gray-600 mb-6">Dữ liệu bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSkeleton({
  className,
  propertyCount = 3,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { propertyCount?: number }) {
  return (
    <div className={cn("min-h-screen bg-gray-50", className)} {...props}>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: propertyCount }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-10 w-28" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export { ErrorState, EmptyState, LoadingSkeleton };

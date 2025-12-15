"use client";

import { ReduxProvider } from "./reduxProvider";
import { QueryProvider } from "./queryProvider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
        <Toaster position="top-right" expand={true} richColors closeButton />
      </QueryProvider>
    </ReduxProvider>
  );
}

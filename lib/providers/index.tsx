"use client";

import { ReduxProvider } from "./reduxProvider";
import { QueryProvider } from "./queryProvider";
import { Toaster } from "@/components/ui";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
        <Toaster />
      </QueryProvider>
    </ReduxProvider>
  );
}

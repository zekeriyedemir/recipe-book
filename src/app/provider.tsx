"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/utils/makeQueryClient";
import { useState, type ReactNode } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CookbookEntry } from "@/types/cookbook";

export const cookbookKey = ["cookbook"] as const;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    cache: "no-store",
    headers: { "Content-Type": "application/json", "X-Cookbook-Request": "1" },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Your cookbook could not be updated.");
  return result as T;
}

export function fetchCookbook(): Promise<CookbookEntry[]> {
  return request<CookbookEntry[]>("/api/cookbook");
}

type CookbookChange =
  | { action: "save"; recipeId: number }
  | { action: "update"; recipeId: number; notes: string }
  | { action: "remove"; recipeId: number };

export function useCookbookMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    // Serialize writes, including first saves that establish the visitor cookie.
    scope: { id: "cookbook" },
    mutationFn: (change: CookbookChange) => {
      if (change.action === "save") {
        return request("/api/cookbook", { method: "POST", body: JSON.stringify({ recipeId: change.recipeId }) });
      }
      return request(`/api/cookbook/${change.recipeId}`, {
        method: change.action === "update" ? "PATCH" : "DELETE",
        ...(change.action === "update" ? { body: JSON.stringify({ notes: change.notes }) } : {}),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cookbookKey }),
  });
}

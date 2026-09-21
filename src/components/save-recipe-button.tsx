"use client";

import Link from "next/link";
import { useCookbookMutation } from "@/utils/cookbook-client";

export default function SaveRecipeButton({ recipeId }: { recipeId: number }) {
  const mutation = useCookbookMutation();
  return (
    <div className="space-y-2">
      <button className="rounded border p-2 disabled:opacity-50" disabled={mutation.isPending}
        onClick={() => mutation.mutate({ action: "save", recipeId })}>
        {mutation.isPending ? "Saving…" : "Save to cookbook"}
      </button>
      {mutation.isError && <p role="alert">{mutation.error.message}</p>}
      {mutation.isSuccess && <p role="status">Saved to your cookbook.</p>}
      <p><Link className="underline" href="/cookbook">View my cookbook</Link></p>
    </div>
  );
}

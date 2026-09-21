"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { CookbookEntry } from "@/types/cookbook";
import { cookbookKey, fetchCookbook, useCookbookMutation } from "@/utils/cookbook-client";
import { MAX_NOTES_LENGTH } from "@/utils/validation";

function CookbookItem({ entry }: { entry: CookbookEntry }) {
  const [notes, setNotes] = useState(entry.notes);
  const mutation = useCookbookMutation();
  return (
    <article className="space-y-2 rounded border p-4">
      <h2 className="text-xl"><Link className="underline" href={`/recipes/${entry.id}`}>{entry.title}</Link></h2>
      <p>{entry.category} · {entry.duration} minutes · {entry.servings} servings</p>
      <form className="space-y-2" onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate({ action: "update", recipeId: entry.id, notes });
      }}>
        <label className="block" htmlFor={`notes-${entry.id}`}>My notes</label>
        <textarea className="block w-full rounded border p-2" id={`notes-${entry.id}`} value={notes}
          maxLength={MAX_NOTES_LENGTH} disabled={mutation.isPending} onChange={(event) => {
            setNotes(event.target.value);
            mutation.reset();
          }} />
        <button className="rounded border p-2 disabled:opacity-50" disabled={mutation.isPending} type="submit">Save notes</button>{" "}
        <button className="rounded border p-2 disabled:opacity-50" disabled={mutation.isPending} type="button"
          onClick={() => mutation.mutate({ action: "remove", recipeId: entry.id })}>Remove recipe</button>
      </form>
      {mutation.isPending && <p role="status">Updating cookbook…</p>}
      {mutation.isError && <p role="alert">{mutation.error.message}</p>}
      {mutation.isSuccess && <p role="status">Notes saved.</p>}
    </article>
  );
}

export default function CookbookList() {
  const query = useQuery({ queryKey: cookbookKey, queryFn: fetchCookbook });
  if (query.isPending) return <p role="status">Loading cookbook…</p>;
  if (query.isError) return <div role="alert"><p>{query.error.message}</p><button className="rounded border p-2" onClick={() => query.refetch()}>Try again</button></div>;
  if (query.data.length === 0) return <p>Your cookbook is empty. <Link className="underline" href="/">Find a recipe to save.</Link></p>;
  return <div className="space-y-4">{query.data.map((entry) => <CookbookItem key={entry.id} entry={entry} />)}</div>;
}

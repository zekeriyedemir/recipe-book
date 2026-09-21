"use client";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="space-y-4 p-4">
      <h1 className="text-xl">We could not load your recipes.</h1>
      <p>Please try again in a moment.</p>
      <button className="rounded border p-2" onClick={() => retry()}>Try again</button>
    </main>
  );
}

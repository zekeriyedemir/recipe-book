import Link from "next/link";
import CookbookList from "@/components/cookbook-list";

export default function CookbookPage() {
  return (
    <main className="space-y-4 p-4">
      <Link className="underline" href="/">All recipes</Link>
      <h1 className="text-2xl font-bold">My cookbook</h1>
      <p>Your cookbook belongs to this browser. Keep cookies to access your saved recipes.</p>
      <CookbookList />
    </main>
  );
}

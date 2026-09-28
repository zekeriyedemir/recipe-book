import Link from "next/link";
import CookbookList from "@/components/cookbook-list";

export default function CookbookPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 px-6 py-10">
      <Link className="link link-hover" href="/">
        All recipes
      </Link>

      <h1 className="text-3xl font-bold">My cookbook</h1>

      <p className="text-base-content/70">
        Your cookbook belongs to this browser. Keep cookies to access your saved
        recipes.
      </p>

      <CookbookList />
    </main>
  );
}

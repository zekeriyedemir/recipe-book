import HomePage from "@/components/HomePage";
import { getRecipes } from "@/utils/recipes";
import { normalizeSearch } from "@/utils/validation";

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const search = normalizeSearch(Array.isArray(q) ? q[0] : q);
  return <HomePage recipes={await getRecipes(search)} searchQuery={search} />;
}

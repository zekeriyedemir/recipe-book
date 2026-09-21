import HomePage from "@/components/HomePage";
import { getRecipes } from "@/utils/recipes";

export const dynamic = "force-dynamic";

export default async function Home() {
  return <HomePage recipes={await getRecipes()} />;
}

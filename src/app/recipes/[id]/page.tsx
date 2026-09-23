import RecipeDetails from "@/components/RecipeDetails";
import { notFound } from "next/navigation";
import { getRecipeById } from "@/utils/recipes";
import { parseRecipeId } from "@/utils/validation";

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseRecipeId((await params).id);
  if (id === null) notFound();
  const recipe = await getRecipeById(id);
  if (!recipe) notFound();
  return <RecipeDetails recipe={recipe} />;
}

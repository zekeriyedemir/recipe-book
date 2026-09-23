import { getRecipeById } from "@/utils/recipes";
import { parseRecipeId } from "@/utils/validation";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = parseRecipeId((await params).id);
  if (id === null) return Response.json({ error: "Invalid recipe ID." }, { status: 400 });
  try {
    const recipe = await getRecipeById(id);
    return recipe
      ? Response.json(recipe, { headers: { "Cache-Control": "no-store" } })
      : Response.json({ error: "Recipe not found." }, { status: 404 });
  } catch {
    return Response.json({ error: "We could not load this recipe. Please try again." }, { status: 503 });
  }
}

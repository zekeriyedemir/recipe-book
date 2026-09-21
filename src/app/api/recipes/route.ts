import { getRecipes } from "@/utils/recipes";

export async function GET() {
  try {
    return Response.json(await getRecipes(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "We could not load recipes. Please try again." }, { status: 503 });
  }
}

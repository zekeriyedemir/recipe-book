import { getRecipes } from "@/utils/recipes";

export async function GET(request: Request) {
  try {
    return Response.json(await getRecipes(new URL(request.url).searchParams.get("q") ?? ""), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "We could not load recipes. Please try again." }, { status: 503 });
  }
}

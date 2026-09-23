import { getCookbook, saveRecipe } from "@/utils/cookbook";
import { createVisitorToken, getVisitorToken, setVisitorToken, visitorId } from "@/utils/visitor";
import { checkWriteRequest, databaseError, json, readJson } from "@/utils/api";
import { parseRecipeId } from "@/utils/validation";

export async function GET() {
  try {
    const token = await getVisitorToken();
    return json(token ? await getCookbook(visitorId(token)) : []);
  } catch {
    return databaseError();
  }
}

export async function POST(request: Request) {
  const rejected = checkWriteRequest(request);
  if (rejected) return rejected;
  const body = await readJson(request);
  const recipeId = parseRecipeId(body?.recipeId);
  if (recipeId === null) return json({ error: "A valid recipe ID is required." }, 400);

  try {
    const existingToken = await getVisitorToken();
    const token = existingToken ?? createVisitorToken();
    if (!await saveRecipe(visitorId(token), recipeId)) return json({ error: "Recipe not found." }, 404);
    if (!existingToken) await setVisitorToken(token);
    return json({ success: true });
  } catch {
    return databaseError();
  }
}

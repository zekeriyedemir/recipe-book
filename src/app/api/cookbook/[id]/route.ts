import { removeRecipe, updateNotes } from "@/utils/cookbook";
import { getVisitorToken, visitorId } from "@/utils/visitor";
import { checkWriteRequest, databaseError, json, readJson } from "@/utils/api";
import { isValidNotes, parseRecipeId } from "@/utils/validation";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const rejected = checkWriteRequest(request);
  if (rejected) return rejected;
  const id = parseRecipeId((await params).id);
  const body = await readJson(request);
  if (id === null || !isValidNotes(body?.notes)) {
    return json({ error: "Provide a valid recipe ID and notes of at most 5,000 characters." }, 400);
  }
  try {
    const token = await getVisitorToken();
    if (!token || !await updateNotes(visitorId(token), id, body.notes)) {
      return json({ error: "Saved recipe not found." }, 404);
    }
    return json({ success: true });
  } catch {
    return databaseError();
  }
}

export async function DELETE(request: Request, { params }: Context) {
  const rejected = checkWriteRequest(request);
  if (rejected) return rejected;
  const id = parseRecipeId((await params).id);
  if (id === null) return json({ error: "A valid recipe ID is required." }, 400);
  try {
    const token = await getVisitorToken();
    if (!token || !await removeRecipe(visitorId(token), id)) {
      return json({ error: "Saved recipe not found." }, 404);
    }
    return json({ success: true });
  } catch {
    return databaseError();
  }
}

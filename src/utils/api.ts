import "server-only";

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "private, no-store" } });
}

export function databaseError() {
  // Do not send database errors, query parameters or credentials to the client.
  return json({ error: "We could not reach the database. Please try again." }, 503);
}

export function checkWriteRequest(request: Request): Response | null {
  // A custom header forces cross-origin browser requests through a CORS preflight.
  // These routes never grant CORS permission.
  if (request.headers.get("X-Cookbook-Request") !== "1") {
    return json({ error: "Invalid cookbook request." }, 403);
  }
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: "Invalid request origin." }, 403);
  }
  return null;
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) return null;
  try {
    const value: unknown = await request.json();
    return value !== null && typeof value === "object" && !Array.isArray(value)
      ? value as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

export function parseRecipeId(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  if (!/^[1-9][0-9]*$/.test(String(value))) return null;
  const id = Number(value);
  return Number.isInteger(id) && id <= 2147483647 ? id : null;
}


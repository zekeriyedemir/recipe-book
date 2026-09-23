export const MAX_SEARCH_LENGTH = 200;

export function parseRecipeId(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  if (!/^[1-9][0-9]*$/.test(String(value))) return null;
  const id = Number(value);
  return Number.isInteger(id) && id <= 2147483647 ? id : null;
}

export function normalizeSearch(value: unknown): string {
  return typeof value === "string" ? value.replaceAll("\0", "").trim().slice(0, MAX_SEARCH_LENGTH) : "";
}

export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`);
}

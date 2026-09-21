import "server-only";
import { getSql } from "./db";
import type { CookbookEntry } from "@/types/cookbook";

export async function getCookbook(visitor: string): Promise<CookbookEntry[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT r.*, c.notes, c.saved_at, c.updated_at
    FROM cookbook c JOIN recipes r ON r.id = c.recipe_id
    WHERE c.visitor_id = ${visitor}
    ORDER BY c.saved_at DESC, r.id
  `;
  return rows as CookbookEntry[];
}

export async function saveRecipe(visitor: string, recipeId: number): Promise<boolean> {
  const sql = getSql();
  // A duplicate save keeps existing notes and the original saved date.
  const rows = await sql`
    INSERT INTO cookbook (visitor_id, recipe_id)
    SELECT ${visitor}, id FROM recipes WHERE id = ${recipeId}
    ON CONFLICT (visitor_id, recipe_id) DO UPDATE SET recipe_id = EXCLUDED.recipe_id
    RETURNING recipe_id
  `;
  return rows.length > 0;
}

export async function updateNotes(visitor: string, recipeId: number, notes: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    UPDATE cookbook SET notes = ${notes}, updated_at = NOW()
    WHERE visitor_id = ${visitor} AND recipe_id = ${recipeId}
    RETURNING recipe_id
  `;
  return rows.length > 0;
}

export async function removeRecipe(visitor: string, recipeId: number): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    DELETE FROM cookbook WHERE visitor_id = ${visitor} AND recipe_id = ${recipeId}
    RETURNING recipe_id
  `;
  return rows.length > 0;
}

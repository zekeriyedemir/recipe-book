import "server-only";
import { getSql } from "./db";
import type { Recipe } from "@/types/recipe";

export async function getRecipes(): Promise<Recipe[]> {
  const sql = getSql();
  return await sql`SELECT * FROM recipes ORDER BY id` as Recipe[];
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM recipes WHERE id = ${id}`;
  return (rows[0] as Recipe | undefined) ?? null;
}

import "server-only";
import { getSql } from "./db";
import { escapeLike, normalizeSearch } from "./validation";
import type { Recipe } from "@/types/recipe";

export async function getRecipes(search = ""): Promise<Recipe[]> {
  const sql = getSql();
  const pattern = `%${escapeLike(normalizeSearch(search))}%`;
  const recipes = await sql`
    SELECT * FROM recipes
    WHERE title ILIKE ${pattern} OR category ILIKE ${pattern}
    ORDER BY id
  `;
  return recipes as Recipe[];
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  const sql = getSql();
  const recipes = await sql`SELECT * FROM recipes WHERE id = ${id}`;
  return (recipes[0] as Recipe | undefined) ?? null;
}

import sql from "./db";
import type { Recipe } from "@/types/recipe";

export async function getRecipes(): Promise<Recipe[]> {
    const recipes = await sql `SELECT * FROM recipes`;
    
    return recipes as Recipe[];
}
import type { Recipe } from "@/types/recipe";

async function readJson<T>(response: Response, message: string): Promise<T> {
  if (!response.ok) {
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function fetchAllRecipes(): Promise<Recipe[]> {
  const response = await fetch("/api/recipes");
  return readJson<Recipe[]>(response, "Failed to fetch recipes");
}

export async function fetchRecipeById(id: number | string): Promise<Recipe | null> {
  const response = await fetch(`/api/recipes/${id}`);

  if (response.status === 404) {
    return null;
  }

  return readJson<Recipe>(response, "Failed to fetch recipe");
}

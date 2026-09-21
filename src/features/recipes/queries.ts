import { queryOptions } from "@tanstack/react-query";
import { fetchAllRecipes, fetchRecipeById } from "./server";

export const getRecipesQuery = (search = "") =>
  queryOptions({
    queryKey: ["recipes", search],
    queryFn: () => fetchAllRecipes(search),
  });

export const getRecipeByIdQuery = (id: number | string) =>
  queryOptions({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipeById(id),
  });

import { queryOptions } from "@tanstack/react-query";
import { fetchAllRecipes, fetchRecipeById } from "./server";

export const getRecipesQuery = () =>
  queryOptions({
    queryKey: ["recipes"],
    queryFn: fetchAllRecipes,
  });

export const getRecipeByIdQuery = (id: number | string) =>
  queryOptions({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipeById(id),
  });

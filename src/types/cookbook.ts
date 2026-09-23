import type { Recipe } from "./recipe";

export type CookbookEntry = Recipe & {
  notes: string;
  saved_at: string;
  updated_at: string;
};

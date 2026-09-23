"use client";

import type { Recipe } from "@/types/recipe";

import FeaturedRecipe from "@/features/recipes/components/FeaturedRecipe";
import RecipeCard from "@/features/recipes/components/RecipeCard";

export default function HomePage({ recipes, searchQuery }: { recipes: Recipe[]; searchQuery: string }) {

  // Keep the server and browser render consistent during hydration.
  const featuredRecipes = recipes.slice(0, 4);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const searchResults = recipes;

  if (normalizedSearch) {
    return (
      <main className="flex-1 bg-base-200">
        <section className="mx-auto max-w-7xl px-8 py-14">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Search Results</p>
            <h1 className="mt-2 text-4xl font-bold">Recipes matching &ldquo;{searchQuery.trim()}&rdquo;</h1>
            <p className="mt-2 text-base-content/60">
              {searchResults.length} {searchResults.length === 1 ? "recipe" : "recipes"} found
            </p>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-4 gap-6">
              {searchResults.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
            </div>
          ) : (
            <div className="rounded-box bg-base-100 p-12 text-center shadow-sm">
              <h2 className="text-2xl font-semibold">No recipes found</h2>
              <p className="mt-2 text-base-content/60">Try another recipe name or category.</p>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-base-200">
      <section className="mx-auto grid min-h-[620px] max-w-7xl grid-cols-[0.9fr_1.1fr] items-center gap-16 px-8 py-16">
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">My Recipes</p>
          <h1 className="text-6xl font-bold leading-[1.05]">Find something<br />delicious to cook.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-base-content/65">
            Discover recipes, find new favourites and bring something good to the table.
          </p>
        </div>

        <div>
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.2em] text-base-content/50">From the kitchen</p>
            <h2 className="mt-1 text-2xl font-semibold">A taste of what&apos;s cooking</h2>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {featuredRecipes.map((recipe) => <FeaturedRecipe key={recipe.id} recipe={recipe} />)}
          </div>
        </div>
      </section>
    </main>
  );
}

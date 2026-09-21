import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "@/types/recipe";

export default function RecipeDetails({ recipe }: { recipe: Recipe }) {
  return (
    <main className="mx-auto max-w-5xl px-8 py-14">
      <Link href="/" className="link link-hover text-sm">← Back to recipes</Link>
      <article className="mt-6 overflow-hidden rounded-box bg-base-100 shadow-md">
        {recipe.image && (
          <div className="relative h-80 w-full">
            <Image src={recipe.image} alt={recipe.title} fill className="object-cover" sizes="1024px" />
          </div>
        )}
        <div className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{recipe.category}</p>
          <h1 className="mt-2 text-4xl font-bold">{recipe.title}</h1>
          <div className="mt-4 flex gap-6 text-base-content/65">
            <span>{recipe.duration} minutes</span>
            <span>{recipe.servings} servings</span>
          </div>
          <p className="mt-6 text-lg leading-8">{recipe.description}</p>
          <h2 className="mt-8 text-2xl font-semibold">Ingredients</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            {recipe.ingredients.map((ingredient, index) => <li key={`${ingredient}-${index}`}>{ingredient}</li>)}
          </ul>
        </div>
      </article>
    </main>
  );
}

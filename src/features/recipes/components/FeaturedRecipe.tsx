import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "@/types/recipe";

function FeaturedRecipe({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="group relative min-h-44 overflow-hidden rounded-box bg-base-300">
      {recipe.image ? (
        <Image src={recipe.image} alt={recipe.title} fill sizes="300px" className="object-cover transition duration-300 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/15"><span className="text-5xl opacity-30">🍽️</span></div>
      )}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-base-100/90 px-4 py-3"><h3 className="font-semibold">{recipe.title}</h3></div>
    </Link>
  );
}
export default FeaturedRecipe;

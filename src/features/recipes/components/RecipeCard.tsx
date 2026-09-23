import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUtensils } from "@fortawesome/free-solid-svg-icons";
import type { Recipe } from "@/types/recipe";

function RecipeCard({ recipe: { id, title, duration, category, image, servings, description } }: { recipe: Recipe }) {
  return (
    <article className="card overflow-hidden bg-base-100 shadow-md transition-shadow hover:shadow-lg">
      {image && <figure className="relative h-52 w-full"><Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" /></figure>}
      <div className="card-body">
        <div className="flex items-start justify-between gap-3"><h2 className="card-title"><Link href={`/recipes/${id}`}>{title}</Link></h2>{category && <span className="badge badge-primary badge-outline">{category}</span>}</div>
        {description && <p className="line-clamp-2 text-sm text-base-content/70">{description}</p>}
        <div className="mt-3 flex gap-5 text-sm text-base-content/70">
          <span className="flex items-center gap-2"><FontAwesomeIcon icon={faClock} />{duration} min</span>
          <span className="flex items-center gap-2"><FontAwesomeIcon icon={faUtensils} />{servings} servings</span>
        </div>
      </div>
    </article>
  );
}
export default RecipeCard;

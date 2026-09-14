import { getRecipes } from "@/utils/recipes";

export default async function Home() {
  const recipes = await getRecipes();

  return (
    <main>
      <h1>Recipe Book</h1>
      {recipes.map((recipe) => (
  <div key={recipe.id}>
    <h2>{recipe.title}</h2>
    <p>{recipe.category}</p>
    <p>{recipe.duration} minutes</p>
    <p>{recipe.servings} servings</p>
  </div>
))}
    </main>
  );
}
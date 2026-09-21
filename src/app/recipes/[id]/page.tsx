import RecipeDetails from "@/components/RecipeDetails";

type RecipePageProps = {
  params: Promise<{ id: string }>;
};

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  return <RecipeDetails id={id} />;
}

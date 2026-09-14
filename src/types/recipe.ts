export type Recipe = {
  id: number;
  title: string;
  category: string;
  duration: number;
  servings: number;
  ingredients: string[];
  description: string;
  image: string | null;
  created_at: Date;
};
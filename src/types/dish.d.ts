const ALLERGEN_KEYS = [
  "gluten",
  "peanuts",
  "seafood",
  "dairy",
  "eggs",
  "soy",
  "tree_nuts",
  "wheat",
  "fish",
  "shellfish",
] as const;

export type Allergy = (typeof ALLERGEN_KEYS)[number];
export interface IDish {
  id: string;
  name: string;
  detail: string;
  price: number;
  allergy: Allergy[];
  restaurant_id: string;
  is_out_of_stock: boolean;
  image: string;
}

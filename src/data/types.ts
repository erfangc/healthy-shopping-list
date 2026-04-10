export type Language = "en" | "zh";

export interface GroceryItem {
  product_id: string;
  slug: string;
  name: string;
  name_zh: string | null;
  image_url: string | null;
  price: string;
  unit_price: string | null;
  health_note: string;
  product_url: string;
}

export interface Category {
  health_rationale: string;
  items: GroceryItem[];
}

export const CATEGORY_KEYS = [
  "vegetables",
  "fruits",
  "tofu_and_vegan",
  "seafood",
  "meat_lean_options",
  "frozen_healthy_picks",
  "dry_goods",
  "instant_and_prepackaged",
  "beverages",
  "snacks",
  "dairy_and_eggs",
  "seasoning_healthy_picks",
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export interface GroceryData {
  metadata: {
    source: string;
    generated_date: string;
    criteria: string;
    store: string;
    base_url: string;
    note: string;
  };
  categories: Record<CategoryKey, Category>;
}

// Dish-related types

export interface GroceryMatch {
  product_id: string;
  name: string;
  category: string;
}

export interface DishIngredient {
  name_zh: string;
  name_en: string;
  amount: string;
  grocery_match: GroceryMatch | null;
  missing_importance?: "low" | "med" | "high";
}

export type DishCategory = "热菜" | "主食" | "凉菜";
export type DishDifficulty = "简单" | "普通" | "高级" | "神级";

export interface Dish {
  id: string;
  name_zh: string;
  name_en: string;
  description_zh: string;
  recipe_url: string;
  topic_url: string;
  category: DishCategory;
  flavor: string;
  cooking_method: string;
  time_required: string | null;
  difficulty: DishDifficulty;
  ingredients: {
    main: DishIngredient[];
    auxiliary?: DishIngredient[];
    seasonings?: DishIngredient[];
  };
}

export interface DishData {
  metadata: {
    source_url: string;
    source_name: string;
    scraped_date: string;
    description: string;
    total_dishes: number;
    selection_criteria: string;
  };
  dishes: Dish[];
}

export interface RankedDish extends Dish {
  totalIngredients: number;
  matchedIngredients: number;
  missingIngredients: number;
  healthScore: number;
}

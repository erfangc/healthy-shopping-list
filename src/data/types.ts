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

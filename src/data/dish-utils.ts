import type { Dish, DishIngredient, Language, RankedDish } from "./types";

export interface DishFilterState {
  category: string;
  flavor: string;
  difficulty: string;
  cookingMethod: string;
}

export function getAllIngredients(dish: Dish): DishIngredient[] {
  return [
    ...dish.ingredients.main,
    ...(dish.ingredients.auxiliary ?? []),
    ...(dish.ingredients.seasonings ?? []),
  ];
}

export function computeDishScore(dish: Dish): RankedDish {
  const all = getAllIngredients(dish);
  const totalIngredients = all.length;
  const matchedIngredients = all.filter((i) => i.grocery_match !== null).length;
  const missingIngredients = totalIngredients - matchedIngredients;
  const healthScore = totalIngredients > 0 ? matchedIngredients / totalIngredients : 0;
  return { ...dish, totalIngredients, matchedIngredients, missingIngredients, healthScore };
}

export function rankDishes(dishes: Dish[]): RankedDish[] {
  return dishes
    .map(computeDishScore)
    .sort((a, b) => a.missingIngredients - b.missingIngredients || b.healthScore - a.healthScore);
}

export function filterDishes(
  dishes: RankedDish[],
  filters: DishFilterState,
  searchQuery: string,
  language: Language,
): RankedDish[] {
  let result = dishes;

  if (filters.category !== "all") {
    result = result.filter((d) => d.category === filters.category);
  }
  if (filters.flavor !== "all") {
    result = result.filter((d) => d.flavor === filters.flavor);
  }
  if (filters.difficulty !== "all") {
    result = result.filter((d) => d.difficulty === filters.difficulty);
  }
  if (filters.cookingMethod !== "all") {
    result = result.filter((d) => d.cooking_method === filters.cookingMethod);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (d) =>
        d.name_en.toLowerCase().includes(q) ||
        d.name_zh.includes(q) ||
        (language === "en"
          ? d.description_zh.toLowerCase().includes(q)
          : d.description_zh.includes(q)),
    );
  }

  return result;
}

export function buildGroceryToDishMap(dishes: Dish[]): Map<string, Dish[]> {
  const map = new Map<string, Dish[]>();
  for (const dish of dishes) {
    for (const ing of getAllIngredients(dish)) {
      if (ing.grocery_match) {
        const pid = ing.grocery_match.product_id;
        if (!map.has(pid)) map.set(pid, []);
        // avoid duplicating the same dish for the same product
        const list = map.get(pid)!;
        if (!list.some((d) => d.id === dish.id)) {
          list.push(dish);
        }
      }
    }
  }
  return map;
}

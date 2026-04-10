import type { DishCategory, DishDifficulty } from "./types";

export const DISH_CATEGORY_LABELS: Record<
  DishCategory,
  { en: string; zh: string; emoji: string }
> = {
  "热菜": { en: "Hot Dishes", zh: "热菜", emoji: "🔥" },
  "主食": { en: "Staples", zh: "主食", emoji: "🍚" },
  "凉菜": { en: "Cold Dishes", zh: "凉菜", emoji: "🥒" },
};

export const DIFFICULTY_LABELS: Record<
  DishDifficulty,
  { en: string; zh: string }
> = {
  "简单": { en: "Easy", zh: "简单" },
  "普通": { en: "Medium", zh: "普通" },
  "高级": { en: "Advanced", zh: "高级" },
  "神级": { en: "Master", zh: "神级" },
};

export const FLAVOR_LABELS: Record<string, { en: string; zh: string }> = {
  "中辣": { en: "Medium Spicy", zh: "中辣" },
  "原味": { en: "Original", zh: "原味" },
  "咸甜": { en: "Savory-Sweet", zh: "咸甜" },
  "咸香": { en: "Savory", zh: "咸香" },
  "咸鲜": { en: "Umami", zh: "咸鲜" },
  "微辣": { en: "Mild Spicy", zh: "微辣" },
  "清淡": { en: "Light", zh: "清淡" },
  "甜辣": { en: "Sweet-Spicy", zh: "甜辣" },
  "酸甜": { en: "Sweet & Sour", zh: "酸甜" },
  "酸辣": { en: "Hot & Sour", zh: "酸辣" },
  "鱼香": { en: "Yu Xiang", zh: "鱼香" },
  "麻辣": { en: "Mala", zh: "麻辣" },
};

export const COOKING_METHOD_LABELS: Record<string, { en: string; zh: string }> = {
  "炒": { en: "Stir-Fry", zh: "炒" },
  "炖": { en: "Braise", zh: "炖" },
  "炸": { en: "Deep-Fry", zh: "炸" },
  "烧": { en: "Red Cook", zh: "烧" },
  "煮": { en: "Boil", zh: "煮" },
  "爆": { en: "Quick-Fry", zh: "爆" },
  "蒸": { en: "Steam", zh: "蒸" },
};

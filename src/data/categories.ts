import type { CategoryKey } from "./types";

export const CATEGORY_LABELS: Record<
  CategoryKey,
  { en: string; zh: string; emoji: string }
> = {
  vegetables: { en: "Vegetables", zh: "蔬菜", emoji: "🥬" },
  fruits: { en: "Fruits", zh: "水果", emoji: "🍎" },
  tofu_and_vegan: { en: "Tofu & Vegan", zh: "豆腐素食", emoji: "🫘" },
  seafood: { en: "Seafood", zh: "海鲜", emoji: "🐟" },
  meat_lean_options: { en: "Lean Meat", zh: "精瘦肉类", emoji: "🍗" },
  frozen_healthy_picks: { en: "Frozen Picks", zh: "冷冻精选", emoji: "🧊" },
  dry_goods: { en: "Dry Goods", zh: "干货杂粮", emoji: "🌾" },
  instant_and_prepackaged: { en: "Instant & Packaged", zh: "即食预包装", emoji: "🍜" },
  beverages: { en: "Beverages", zh: "饮品", emoji: "🥤" },
  snacks: { en: "Snacks", zh: "零食", emoji: "🍘" },
  dairy_and_eggs: { en: "Dairy & Eggs", zh: "乳蛋类", emoji: "🥚" },
  seasoning_healthy_picks: { en: "Seasonings", zh: "调味品", emoji: "🧂" },
};

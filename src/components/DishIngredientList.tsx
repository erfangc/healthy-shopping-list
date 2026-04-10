import { Link } from "react-router-dom";
import type { Dish, DishIngredient, Language } from "../data/types";

interface DishIngredientListProps {
  ingredients: Dish["ingredients"];
  language: Language;
}

function IngredientItem({
  ing,
  language,
}: {
  ing: DishIngredient;
  language: Language;
}) {
  const name = language === "zh" ? ing.name_zh : ing.name_en;
  const altName = language === "zh" ? ing.name_en : ing.name_zh;

  if (ing.grocery_match) {
    return (
      <li className="flex items-start gap-2 py-1.5">
        <svg
          className="w-4 h-4 mt-0.5 shrink-0 text-primary-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {name}
            </span>
            <span className="text-xs text-gray-400">{altName}</span>
            {ing.amount && (
              <span className="text-xs text-gray-400">({ing.amount})</span>
            )}
          </div>
          <Link
            to={`/?search=${encodeURIComponent(ing.name_en)}`}
            className="text-xs text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {language === "zh" ? "🛒 " : "🛒 "}
            {ing.grocery_match.name}
          </Link>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-2 py-1.5">
      <svg
        className={`w-4 h-4 mt-0.5 shrink-0 ${
          ing.missing_importance === "high"
            ? "text-orange-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {name}
          </span>
          <span className="text-xs text-gray-400">{altName}</span>
          {ing.amount && (
            <span className="text-xs text-gray-400">({ing.amount})</span>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {language === "zh" ? "购物清单中无此项" : "Not in shopping list"}
        </span>
      </div>
    </li>
  );
}

export default function DishIngredientList({
  ingredients,
  language,
}: DishIngredientListProps) {
  const groups: { key: string; titleEn: string; titleZh: string; items: DishIngredient[] }[] = [
    { key: "main", titleEn: "Main Ingredients", titleZh: "主料", items: ingredients.main },
  ];
  if (ingredients.auxiliary && ingredients.auxiliary.length > 0) {
    groups.push({ key: "auxiliary", titleEn: "Auxiliary", titleZh: "辅料", items: ingredients.auxiliary });
  }
  if (ingredients.seasonings && ingredients.seasonings.length > 0) {
    groups.push({ key: "seasonings", titleEn: "Seasonings", titleZh: "调料", items: ingredients.seasonings });
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.key}>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 pb-1 border-b border-gray-200 dark:border-gray-700">
            {language === "zh" ? group.titleZh : group.titleEn}
            <span className="text-xs font-normal text-gray-400 ml-2">
              ({group.items.length})
            </span>
          </h4>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {group.items.map((ing, idx) => (
              <IngredientItem key={`${group.key}-${idx}`} ing={ing} language={language} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

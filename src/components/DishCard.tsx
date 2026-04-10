import { Link } from "react-router-dom";
import type { Language, RankedDish } from "../data/types";
import { DISH_CATEGORY_LABELS, DIFFICULTY_LABELS, FLAVOR_LABELS, COOKING_METHOD_LABELS } from "../data/dish-categories";
import HealthScoreBar from "./HealthScoreBar";

interface DishCardProps {
  dish: RankedDish;
  language: Language;
}

export default function DishCard({ dish, language }: DishCardProps) {
  const displayName = language === "zh" ? dish.name_zh : dish.name_en;
  const altName = language === "zh" ? dish.name_en : dish.name_zh;

  const catLabel = DISH_CATEGORY_LABELS[dish.category];
  const diffLabel = DIFFICULTY_LABELS[dish.difficulty];
  const flavorLabel = FLAVOR_LABELS[dish.flavor];
  const methodLabel = COOKING_METHOD_LABELS[dish.cooking_method];

  return (
    <Link
      to={`/dishes/${dish.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200"
    >
      <div className="p-4">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
            {catLabel?.emoji} {language === "zh" ? catLabel?.zh : catLabel?.en}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            dish.difficulty === "简单"
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
              : dish.difficulty === "普通"
                ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
                : dish.difficulty === "高级"
                  ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
          }`}>
            {language === "zh" ? diffLabel?.zh : diffLabel?.en}
          </span>
        </div>

        {/* Dish name */}
        <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {displayName}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{altName}</p>

        {/* Metadata tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {flavorLabel && (
            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {language === "zh" ? flavorLabel.zh : flavorLabel.en}
            </span>
          )}
          {methodLabel && (
            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {language === "zh" ? methodLabel.zh : methodLabel.en}
            </span>
          )}
          {dish.time_required && (
            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {dish.time_required}
            </span>
          )}
        </div>

        {/* Health score bar */}
        <div className="mt-3">
          <HealthScoreBar
            matched={dish.matchedIngredients}
            total={dish.totalIngredients}
            language={language}
          />
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 line-clamp-2 leading-relaxed">
          {dish.description_zh}
        </p>
      </div>
    </Link>
  );
}

import { Link, useParams } from "react-router-dom";
import dishData from "../data/classic-dishes.json";
import type { DishData, Language } from "../data/types";
import { computeDishScore } from "../data/dish-utils";
import {
  DISH_CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  FLAVOR_LABELS,
  COOKING_METHOD_LABELS,
} from "../data/dish-categories";
import HealthScoreBar from "../components/HealthScoreBar";
import DishIngredientList from "../components/DishIngredientList";

const data = dishData as unknown as DishData;

interface DishDetailPageProps {
  language: Language;
}

export default function DishDetailPage({ language }: DishDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const dish = data.dishes.find((d) => d.id === id);

  if (!dish) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-5xl mb-4 block">🍽️</span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {language === "zh" ? "菜谱未找到" : "Dish Not Found"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {language === "zh"
            ? "该菜谱不存在或已被移除"
            : "This dish doesn't exist or has been removed"}
        </p>
        <Link
          to="/dishes"
          className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === "zh" ? "返回菜谱列表" : "Back to dishes"}
        </Link>
      </div>
    );
  }

  const ranked = computeDishScore(dish);
  const catLabel = DISH_CATEGORY_LABELS[dish.category];
  const diffLabel = DIFFICULTY_LABELS[dish.difficulty];
  const flavorLabel = FLAVOR_LABELS[dish.flavor];
  const methodLabel = COOKING_METHOD_LABELS[dish.cooking_method];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link
        to="/dishes"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {language === "zh" ? "返回菜谱列表" : "Back to dishes"}
      </Link>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {language === "zh" ? dish.name_zh : dish.name_en}
        </h1>
        <p className="text-base text-gray-400 mt-1">
          {language === "zh" ? dish.name_en : dish.name_zh}
        </p>
      </div>

      {/* Metadata tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
          {catLabel?.emoji} {language === "zh" ? catLabel?.zh : catLabel?.en}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
        {flavorLabel && (
          <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {language === "zh" ? flavorLabel.zh : flavorLabel.en}
          </span>
        )}
        {methodLabel && (
          <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {language === "zh" ? methodLabel.zh : methodLabel.en}
          </span>
        )}
        {dish.time_required && (
          <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            ⏱ {dish.time_required}
          </span>
        )}
      </div>

      {/* Health score */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {language === "zh" ? "食材可购评分" : "Ingredient Availability"}
        </h3>
        <HealthScoreBar
          matched={ranked.matchedIngredients}
          total={ranked.totalIngredients}
          language={language}
          size="md"
        />
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {language === "zh" ? "简介" : "About"}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {dish.description_zh}
        </p>
      </div>

      {/* Ingredients */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {language === "zh"
            ? `食材清单 (${ranked.matchedIngredients} 可购 / ${ranked.missingIngredients} 缺少)`
            : `Ingredients (${ranked.matchedIngredients} available / ${ranked.missingIngredients} missing)`}
        </h3>
        <DishIngredientList ingredients={dish.ingredients} language={language} />
      </div>

      {/* External links */}
      <div className="flex flex-wrap gap-3">
        <a
          href={dish.recipe_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {language === "zh" ? "查看完整菜谱" : "View Full Recipe"}
        </a>
        <a
          href={dish.topic_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {language === "zh" ? "浏览更多做法" : "Browse More Recipes"}
        </a>
      </div>
    </div>
  );
}

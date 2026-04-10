import { useState, useMemo } from "react";
import dishData from "../data/classic-dishes.json";
import type { DishData, Language } from "../data/types";
import type { DishFilterState } from "../data/dish-utils";
import { rankDishes, filterDishes } from "../data/dish-utils";
import DishFilters from "../components/DishFilters";
import DishCard from "../components/DishCard";

const data = dishData as unknown as DishData;

interface DishListPageProps {
  language: Language;
  searchQuery: string;
}

export default function DishListPage({ language, searchQuery }: DishListPageProps) {
  const [filters, setFilters] = useState<DishFilterState>({
    category: "all",
    flavor: "all",
    difficulty: "all",
    cookingMethod: "all",
  });

  const rankedDishes = useMemo(() => rankDishes(data.dishes), []);

  const filteredDishes = useMemo(
    () => filterDishes(rankedDishes, filters, searchQuery, language),
    [rankedDishes, filters, searchQuery, language],
  );

  return (
    <>
      <DishFilters
        filters={filters}
        onFilterChange={setFilters}
        language={language}
      />

      <div className="md:ml-56 max-w-6xl mx-auto px-4 py-6">
        <main className="min-w-0">
          {/* Page header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🍳 {language === "zh" ? "经典家常菜" : "Classic Home-Cooked Dishes"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {language === "zh"
                ? `按可购食材比例排序 · 显示 ${filteredDishes.length} / ${data.dishes.length} 道菜`
                : `Ranked by available ingredients · Showing ${filteredDishes.length} of ${data.dishes.length} dishes`}
            </p>
          </div>

          {/* Dish grid */}
          {filteredDishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {language === "zh" ? "未找到菜谱" : "No dishes found"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {language === "zh"
                  ? "尝试调整筛选条件"
                  : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} language={language} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

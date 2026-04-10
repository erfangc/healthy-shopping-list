import type { Language } from "../data/types";
import type { DishFilterState } from "../data/dish-utils";
import {
  DISH_CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  FLAVOR_LABELS,
  COOKING_METHOD_LABELS,
} from "../data/dish-categories";

interface DishFiltersProps {
  filters: DishFilterState;
  onFilterChange: (filters: DishFilterState) => void;
  language: Language;
}

function FilterGroup({
  title,
  value,
  options,
  onChange,
  language,
}: {
  title: string;
  value: string;
  options: { key: string; labelEn: string; labelZh: string }[];
  onChange: (val: string) => void;
  language: Language;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => onChange("all")}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
            value === "all"
              ? "bg-primary-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {language === "zh" ? "全部" : "All"}
        </button>
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              value === opt.key
                ? "bg-primary-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {language === "zh" ? opt.labelZh : opt.labelEn}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DishFilters({
  filters,
  onFilterChange,
  language,
}: DishFiltersProps) {
  const categoryOptions = Object.entries(DISH_CATEGORY_LABELS).map(
    ([key, label]) => ({
      key,
      labelEn: `${label.emoji} ${label.en}`,
      labelZh: `${label.emoji} ${label.zh}`,
    }),
  );

  const difficultyOptions = Object.entries(DIFFICULTY_LABELS).map(
    ([key, label]) => ({
      key,
      labelEn: label.en,
      labelZh: label.zh,
    }),
  );

  const flavorOptions = Object.entries(FLAVOR_LABELS).map(([key, label]) => ({
    key,
    labelEn: label.en,
    labelZh: label.zh,
  }));

  const methodOptions = Object.entries(COOKING_METHOD_LABELS).map(
    ([key, label]) => ({
      key,
      labelEn: label.en,
      labelZh: label.zh,
    }),
  );

  const update = (partial: Partial<DishFilterState>) =>
    onFilterChange({ ...filters, ...partial });

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.flavor !== "all" ||
    filters.difficulty !== "all" ||
    filters.cookingMethod !== "all";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block fixed top-[90px] left-0 w-56 h-[calc(100vh-90px)] z-20 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-700">
        <nav className="h-full overflow-y-auto px-3 py-4">
          {hasActiveFilters && (
            <button
              onClick={() =>
                onFilterChange({
                  category: "all",
                  flavor: "all",
                  difficulty: "all",
                  cookingMethod: "all",
                })
              }
              className="w-full mb-4 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition cursor-pointer"
            >
              {language === "zh" ? "清除筛选" : "Clear Filters"}
            </button>
          )}
          <FilterGroup
            title={language === "zh" ? "分类" : "Category"}
            value={filters.category}
            options={categoryOptions}
            onChange={(v) => update({ category: v })}
            language={language}
          />
          <FilterGroup
            title={language === "zh" ? "难度" : "Difficulty"}
            value={filters.difficulty}
            options={difficultyOptions}
            onChange={(v) => update({ difficulty: v })}
            language={language}
          />
          <FilterGroup
            title={language === "zh" ? "口味" : "Flavor"}
            value={filters.flavor}
            options={flavorOptions}
            onChange={(v) => update({ flavor: v })}
            language={language}
          />
          <FilterGroup
            title={language === "zh" ? "烹饪方式" : "Method"}
            value={filters.cookingMethod}
            options={methodOptions}
            onChange={(v) => update({ cookingMethod: v })}
            language={language}
          />
        </nav>
      </aside>

      {/* Mobile horizontal filter bar */}
      <div className="md:hidden sticky top-[58px] z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4 py-2 min-w-max">
          {hasActiveFilters && (
            <button
              onClick={() =>
                onFilterChange({
                  category: "all",
                  flavor: "all",
                  difficulty: "all",
                  cookingMethod: "all",
                })
              }
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 cursor-pointer"
            >
              {language === "zh" ? "清除" : "Clear"}
            </button>
          )}
          {categoryOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => update({ category: opt.key === filters.category ? "all" : opt.key })}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filters.category === opt.key
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              {language === "zh" ? opt.labelZh : opt.labelEn}
            </button>
          ))}
          <span className="w-px h-6 bg-gray-300 dark:bg-gray-600 self-center shrink-0" />
          {flavorOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => update({ flavor: opt.key === filters.flavor ? "all" : opt.key })}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filters.flavor === opt.key
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              {language === "zh" ? opt.labelZh : opt.labelEn}
            </button>
          ))}
          <span className="w-px h-6 bg-gray-300 dark:bg-gray-600 self-center shrink-0" />
          {difficultyOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => update({ difficulty: opt.key === filters.difficulty ? "all" : opt.key })}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filters.difficulty === opt.key
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              {language === "zh" ? opt.labelZh : opt.labelEn}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

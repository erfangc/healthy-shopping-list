import { CATEGORY_LABELS } from "../data/categories";
import type { CategoryKey, GroceryData } from "../data/types";
import { CATEGORY_KEYS } from "../data/types";

interface SidebarProps {
  data: GroceryData;
  selectedCategory: CategoryKey | "all";
  onSelectCategory: (cat: CategoryKey | "all") => void;
  language: "en" | "zh";
}

export default function Sidebar({
  data,
  selectedCategory,
  onSelectCategory,
  language,
}: SidebarProps) {
  const totalItems = CATEGORY_KEYS.reduce(
    (sum, key) => sum + data.categories[key].items.length,
    0
  );

  return (
    <>
      {/* Desktop sidebar - fixed on left side */}
      <aside className="hidden md:block fixed top-[90px] left-0 w-56 h-[calc(100vh-90px)] z-20 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-700">
        <nav className="h-full overflow-y-auto px-3 py-4 space-y-1">
          <button
            onClick={() => onSelectCategory("all")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex items-center ${
              selectedCategory === "all"
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <span className="mr-2">📋</span>
            <span className="flex-1">{language === "zh" ? "全部" : "All"}</span>
            <span className="text-xs text-gray-400">{totalItems}</span>
          </button>

          {CATEGORY_KEYS.map((key) => {
            const label = CATEGORY_LABELS[key];
            const count = data.categories[key].items.length;
            return (
              <button
                key={key}
                onClick={() => onSelectCategory(key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex items-center ${
                  selectedCategory === key
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span className="mr-2">{label.emoji}</span>
                <span className="flex-1">
                  {language === "zh" ? label.zh : label.en}
                </span>
                <span className="text-xs text-gray-400">{count}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile horizontal scroll */}
      <div className="md:hidden sticky top-[82px] z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4 py-2 min-w-max">
          <button
            onClick={() => onSelectCategory("all")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
              selectedCategory === "all"
                ? "bg-primary-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            📋 {language === "zh" ? "全部" : "All"} ({totalItems})
          </button>

          {CATEGORY_KEYS.map((key) => {
            const label = CATEGORY_LABELS[key];
            const count = data.categories[key].items.length;
            return (
              <button
                key={key}
                onClick={() => onSelectCategory(key)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  selectedCategory === key
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                {label.emoji} {language === "zh" ? label.zh : label.en} ({count}
                )
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

import { useState, useMemo } from "react";
import groceryData from "../data/grocery-items.json";
import type { CategoryKey, Dish, GroceryData, GroceryItem, Language } from "../data/types";
import { CATEGORY_KEYS } from "../data/types";
import Sidebar from "../components/Sidebar";
import ProductGrid from "../components/ProductGrid";
import { CATEGORY_LABELS } from "../data/categories";

const data = groceryData as unknown as GroceryData;

const categoryForItem = new Map<string, CategoryKey>();
for (const key of CATEGORY_KEYS) {
  for (const item of data.categories[key].items) {
    categoryForItem.set(item.product_id, key);
  }
}

interface GroceryPageProps {
  language: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  groceryToDishMap: Map<string, Dish[]>;
}

export default function GroceryPage({
  language,
  searchQuery,
  onSearchChange,
  groceryToDishMap,
}: GroceryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | "all">("all");

  const filteredItems = useMemo(() => {
    let items: GroceryItem[];
    if (selectedCategory === "all") {
      items = CATEGORY_KEYS.flatMap((key) => data.categories[key].items);
    } else {
      items = data.categories[selectedCategory].items;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.name_zh && item.name_zh.toLowerCase().includes(q)) ||
          item.health_note.toLowerCase().includes(q),
      );
    }
    return items;
  }, [selectedCategory, searchQuery]);

  const categoryHeader =
    selectedCategory !== "all" ? (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {CATEGORY_LABELS[selectedCategory].emoji}{" "}
          {language === "zh"
            ? CATEGORY_LABELS[selectedCategory].zh
            : CATEGORY_LABELS[selectedCategory].en}
          <span className="text-sm font-normal text-gray-400 ml-2">
            ({filteredItems.length})
          </span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
          {data.categories[selectedCategory].health_rationale}
        </p>
      </div>
    ) : null;

  return (
    <>
      <Sidebar
        data={data}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          onSearchChange("");
        }}
        language={language}
      />

      <div className="md:ml-56 max-w-6xl mx-auto px-4 py-6">
        <main className="min-w-0">
          {categoryHeader}
          <ProductGrid
            items={filteredItems}
            language={language}
            selectedCategory={selectedCategory}
            categoryForItem={categoryForItem}
            searchQuery={searchQuery}
            groceryToDishMap={groceryToDishMap}
          />
        </main>
      </div>
    </>
  );
}

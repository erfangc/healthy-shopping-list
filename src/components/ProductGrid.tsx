import { CATEGORY_LABELS } from "../data/categories";
import type { CategoryKey, GroceryItem } from "../data/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  items: GroceryItem[];
  language: "en" | "zh";
  selectedCategory: CategoryKey | "all";
  categoryForItem?: Map<string, CategoryKey>;
  searchQuery: string;
}

export default function ProductGrid({
  items,
  language,
  selectedCategory,
  categoryForItem,
  searchQuery,
}: ProductGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">🔍</span>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          {language === "zh" ? "未找到商品" : "No products found"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {language === "zh"
            ? `没有匹配"${searchQuery}"的结果`
            : `No results matching "${searchQuery}"`}
        </p>
      </div>
    );
  }

  // When viewing "all", group items by category
  if (selectedCategory === "all" && !searchQuery && categoryForItem) {
    const grouped = new Map<CategoryKey, GroceryItem[]>();
    for (const item of items) {
      const cat = categoryForItem.get(item.product_id);
      if (cat) {
        if (!grouped.has(cat)) grouped.set(cat, []);
        grouped.get(cat)!.push(item);
      }
    }

    return (
      <div className="flex-1 space-y-8">
        {Array.from(grouped.entries()).map(([catKey, catItems]) => {
          const label = CATEGORY_LABELS[catKey];
          return (
            <section key={catKey} id={`cat-${catKey}`}>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {label.emoji}{" "}
                  {language === "zh" ? label.zh : label.en}
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    ({catItems.length})
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {catItems.map((item) => (
                  <ProductCard
                    key={item.product_id}
                    item={item}
                    language={language}
                    categoryEmoji={label.emoji}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  // Single category or search results
  const emoji =
    selectedCategory !== "all"
      ? CATEGORY_LABELS[selectedCategory].emoji
      : "🛒";

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => {
          const itemCat = categoryForItem?.get(item.product_id);
          const itemEmoji = itemCat
            ? CATEGORY_LABELS[itemCat].emoji
            : emoji;
          return (
            <ProductCard
              key={item.product_id}
              item={item}
              language={language}
              categoryEmoji={itemEmoji}
            />
          );
        })}
      </div>
    </div>
  );
}

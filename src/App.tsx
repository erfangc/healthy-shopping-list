import { useState, useMemo, useCallback, useEffect } from "react";
import groceryData from "./data/grocery-items.json";
import type { CategoryKey, GroceryData, GroceryItem } from "./data/types";
import { CATEGORY_KEYS } from "./data/types";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import { CATEGORY_LABELS } from "./data/categories";

const data = groceryData as unknown as GroceryData;

// Build a map from product_id -> category key for grouping
const categoryForItem = new Map<string, CategoryKey>();
for (const key of CATEGORY_KEYS) {
  for (const item of data.categories[key].items) {
    categoryForItem.set(item.product_id, key);
  }
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryKey | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<"en" | "zh">("en");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const toggleLanguage = useCallback(
    () => setLanguage((l) => (l === "en" ? "zh" : "en")),
    []
  );

  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

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
          item.health_note.toLowerCase().includes(q)
      );
    }

    return items;
  }, [selectedCategory, searchQuery]);

  // Category header for single category view
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header
        language={language}
        onLanguageToggle={toggleLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Mobile category bar */}
      <Sidebar
        data={data}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        language={language}
      />

      <div className="md:ml-56 max-w-6xl mx-auto px-4 py-6">
        {/* Main content */}
        <main className="min-w-0">
          {categoryHeader}
          <ProductGrid
            items={filteredItems}
            language={language}
            selectedCategory={selectedCategory}
            categoryForItem={categoryForItem}
            searchQuery={searchQuery}
          />
        </main>
      </div>

      <Footer
        language={language}
        generatedDate={data.metadata.generated_date}
      />

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition flex items-center justify-center cursor-pointer z-40"
          aria-label="Scroll to top"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default App;

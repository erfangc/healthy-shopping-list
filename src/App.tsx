import { useState, useCallback, useEffect, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import dishData from "./data/classic-dishes.json";
import type { DishData, Language } from "./data/types";
import { buildGroceryToDishMap } from "./data/dish-utils";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GroceryPage from "./pages/GroceryPage";
import DishListPage from "./pages/DishListPage";
import DishDetailPage from "./pages/DishDetailPage";

const dishes = (dishData as unknown as DishData).dishes;

function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  const toggleLanguage = useCallback(
    () => setLanguage((l) => (l === "en" ? "zh" : "en")),
    [],
  );

  // Reset search when navigating between pages
  useEffect(() => {
    setSearchQuery("");
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const groceryToDishMap = useMemo(() => buildGroceryToDishMap(dishes), []);

  const isGroceryPage = location.pathname === "/";
  const isDishListPage = location.pathname === "/dishes";
  const showSearch = isGroceryPage || isDishListPage;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header
        language={language}
        onLanguageToggle={toggleLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={showSearch}
        searchPlaceholder={
          isDishListPage
            ? language === "zh" ? "搜索菜谱..." : "Search dishes..."
            : language === "zh" ? "搜索食品..." : "Search groceries..."
        }
        showCriteria={isGroceryPage}
      />

      <Routes>
        <Route
          path="/"
          element={
            <GroceryPage
              language={language}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              groceryToDishMap={groceryToDishMap}
            />
          }
        />
        <Route
          path="/dishes"
          element={
            <DishListPage
              language={language}
              searchQuery={searchQuery}
            />
          }
        />
        <Route
          path="/dishes/:id"
          element={<DishDetailPage language={language} />}
        />
      </Routes>

      <Footer
        language={language}
        generatedDate={(dishData as unknown as DishData).metadata.scraped_date}
      />

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition flex items-center justify-center cursor-pointer z-40"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default App;

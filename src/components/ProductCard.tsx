import { useState } from "react";
import { Link } from "react-router-dom";
import type { Dish, GroceryItem, Language } from "../data/types";

interface ProductCardProps {
  item: GroceryItem;
  language: Language;
  categoryEmoji: string;
  usedInDishes?: Dish[];
}

export default function ProductCard({
  item,
  language,
  categoryEmoji,
  usedInDishes,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dishesExpanded, setDishesExpanded] = useState(false);

  const displayName =
    language === "zh" && item.name_zh ? item.name_zh : item.name;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200">
      {/* Image */}
      <a
        href={item.product_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-square bg-gray-50 dark:bg-gray-900 overflow-hidden relative"
      >
        {item.image_url && !imgError ? (
          <img
            src={item.image_url}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">
            {categoryEmoji}
          </div>
        )}
        {/* External link icon overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs">
            ↗
          </span>
        </div>
      </a>

      {/* Info */}
      <div className="p-3">
        <a
          href={item.product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {displayName}
          </h3>
        </a>

        {/* Show alternate name if in bilingual mode */}
        {language === "zh" && item.name_zh && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
            {item.name}
          </p>
        )}
        {language === "en" && item.name_zh && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
            {item.name_zh}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-base font-bold text-primary-600 dark:text-primary-400">
            {item.price}
          </span>
          {item.unit_price && (
            <span className="text-xs text-gray-400">{item.unit_price}</span>
          )}
        </div>

        {/* Health note */}
        <div className="mt-2">
          <p
            className={`text-xs text-gray-500 dark:text-gray-400 leading-relaxed ${
              expanded ? "" : "line-clamp-2"
            }`}
          >
            💚 {item.health_note}
          </p>
          {item.health_note.length > 80 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary-500 hover:text-primary-600 mt-0.5 cursor-pointer"
            >
              {expanded
                ? language === "zh"
                  ? "收起"
                  : "Less"
                : language === "zh"
                  ? "更多"
                  : "More"}
            </button>
          )}
        </div>

        {/* Used in dishes */}
        {usedInDishes && usedInDishes.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setDishesExpanded(!dishesExpanded)}
              className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 cursor-pointer flex items-center gap-1"
            >
              <span>🍳</span>
              {language === "zh"
                ? `用于 ${usedInDishes.length} 道菜`
                : `Used in ${usedInDishes.length} dish${usedInDishes.length > 1 ? "es" : ""}`}
              <svg
                className={`w-3 h-3 transition-transform ${dishesExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dishesExpanded && (
              <div className="mt-1.5 space-y-0.5">
                {usedInDishes.map((dish) => (
                  <Link
                    key={dish.id}
                    to={`/dishes/${dish.id}`}
                    className="block text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate"
                  >
                    {language === "zh" ? dish.name_zh : dish.name_en}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

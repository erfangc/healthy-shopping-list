import type { Language } from "../data/types";

interface HealthScoreBarProps {
  matched: number;
  total: number;
  language: Language;
  size?: "sm" | "md";
}

export default function HealthScoreBar({
  matched,
  total,
  language,
  size = "sm",
}: HealthScoreBarProps) {
  const pct = total > 0 ? (matched / total) * 100 : 0;
  const barColor =
    pct >= 70
      ? "bg-primary-500"
      : pct >= 40
        ? "bg-yellow-500"
        : "bg-red-500";

  const barHeight = size === "md" ? "h-2.5" : "h-1.5";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`${size === "md" ? "text-sm" : "text-xs"} text-gray-600 dark:text-gray-400`}>
          {language === "zh"
            ? `${matched}/${total} 食材可购`
            : `${matched}/${total} ingredients available`}
        </span>
        <span className={`${size === "md" ? "text-sm" : "text-xs"} font-medium ${
          pct >= 70
            ? "text-primary-600 dark:text-primary-400"
            : pct >= 40
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-red-600 dark:text-red-400"
        }`}>
          {Math.round(pct)}%
        </span>
      </div>
      <div className={`w-full ${barHeight} rounded-full bg-gray-200 dark:bg-gray-700`}>
        <div
          className={`${barHeight} rounded-full ${barColor} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface HeaderProps {
  language: "en" | "zh";
  onLanguageToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({
  language,
  onLanguageToggle,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
        {/* Logo / Title */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🥗</span>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
            {language === "zh" ? "健康购物清单" : "Healthy Shopping List"}
          </h1>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px] max-w-md">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                language === "zh" ? "搜索食品..." : "Search groceries..."
              }
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Language Toggle */}
        <button
          onClick={onLanguageToggle}
          className="shrink-0 px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition cursor-pointer"
        >
          {language === "zh" ? "EN" : "中文"}
        </button>
      </div>

      {/* Health criteria subtitle */}
      <div className="max-w-7xl mx-auto px-4 pb-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {language === "zh"
            ? "筛选标准：低LDL胆固醇影响、低血糖指数、低钠、低饱和脂肪"
            : "Criteria: Low LDL impact, low glycemic index, low sodium, low saturated fat"}
        </p>
      </div>
    </header>
  );
}

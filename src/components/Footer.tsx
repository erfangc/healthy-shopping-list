interface FooterProps {
  language: "en" | "zh";
  generatedDate: string;
}

export default function Footer({ language, generatedDate }: FooterProps) {
  return (
    <footer className="mt-12 border-t border-gray-200 dark:border-gray-700 py-6 px-4 text-center">
      <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xl mx-auto">
        {language === "zh" ? (
          <>
            ⚠️ 本列表仅供参考，不构成医疗建议。请咨询医生或营养师获取个性化饮食指导。
            数据来源：
            <a
              href="https://www.sayweee.com/zh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600"
            >
              sayweee.com
            </a>
            {" "}| 生成日期：{generatedDate}
          </>
        ) : (
          <>
            ⚠️ This list is for reference only and does not constitute medical advice.
            Consult a doctor or dietitian for personalized dietary guidance. Data
            from{" "}
            <a
              href="https://www.sayweee.com/zh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600"
            >
              sayweee.com
            </a>
            {" "}| Generated: {generatedDate}
          </>
        )}
      </p>
    </footer>
  );
}

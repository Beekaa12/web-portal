import React from 'react';
import { useTranslation } from "react-i18next";

const Divider = ({isDarkMode=false}) => {
  const { t, i18n } = useTranslation();
  return (
    <div className={`relative py-16 ${isDarkMode ? "bg-slate-700" : "bg-white"}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-full border-t ${isDarkMode ? "border-gray-500" : "border-gray-200"}`}></div>
      </div>
      <div className="relative flex justify-center">
        <span className={`px-4 ${isDarkMode ? "bg-slate-700 text-gray-300" : "bg-white text-gray-500"} text-lg font-medium`}>
          {t('news')}
        </span>
      </div>
    </div>
  );
};

export default Divider;

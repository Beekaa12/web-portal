import React from 'react';
import { useTranslation } from "react-i18next";

const Divider = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className="relative py-16 bg-white">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="px-4 bg-white text-gray-500 text-lg font-medium">
          {t('news')}
        </span>
      </div>
    </div>
  );
};

export default Divider;

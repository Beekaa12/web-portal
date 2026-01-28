import React from 'react';
import { useTranslation } from "react-i18next";
const Hero = () => {
  const { t, i18n } = useTranslation();
  const heroStyle = {
    backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 58, 95, 0.7)',
    zIndex: 1,
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    maxWidth: '800px',
    padding: '0 20px',
  };

  return (
    <section style={heroStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {t("heroTitle")}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100">
          {t("heroSubtitle")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-[#1e3a5f] px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-lg">
            {t("heroJoin")}
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition text-lg">
            {t("heroLearn")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

// App.js
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Announcements from "./components/Announcements";
import Leaders from "./components/Leaders";
import Contact from "./components/Contact";
import DownloadForms from "./components/DownloadForms";
import Login from "./components/Login";
import Footer from "./components/Footer";
import Divider from "./components/Divider";
import GroupMember from "./components/GroupMember";
import MemberDashboard from "./pages/MemberDashboard";

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { t, i18n } = useTranslation();
  const LanguageSwitcher = ({ className }) => (
    <select
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      value={i18n.language}
      className={`bg-transparent text-white px-1 py-1 rounded hover:border hover:bg-[#06575d] ${className}`}
    >
      <option className="text-black" value="en">
        {t("english")}
      </option>
      <option className="text-black" value="am">
        {t("amharic")}
      </option>
    </select>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-[#1e3a5f] shadow-md py-3" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo.jpg"
                alt="logo"
                className="h-10 w-18 object-cover rounded-sm"
              />
            </Link>
            {/* Desktop Navigation */}
            <div className="flex-1"></div>
            <div className="hidden md:flex space-x-1 gap-2">
              <Link
                to="/"
                className={`px-4 py-2 font-medium ${
                  isScrolled
                    ? "text-white hover:text-blue-200"
                    : "text-white hover:text-blue-200"
                }`}
              >
                {t("home")}
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 font-medium ${
                  isScrolled
                    ? "text-white hover:text-blue-200"
                    : "text-white hover:text-blue-200"
                }`}
              >
                {t("about")}
              </Link>
              <Link
                to="/announcements"
                className={`px-4 py-2 font-medium ${
                  isScrolled
                    ? "text-white hover:text-blue-200"
                    : "text-white hover:text-blue-200"
                }`}
              >
                {t("announcements")}
              </Link>
              <Link
                to="/services"
                className={`px-4 py-2 font-medium ${
                  isScrolled
                    ? "text-white hover:text-blue-200"
                    : "text-white hover:text-blue-200"
                }`}
              >
                {t("services")}
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-2 font-medium ${
                  isScrolled
                    ? "text-white hover:text-blue-200"
                    : "text-white hover:text-blue-200"
                }`}
              >
                {t("contact")}
              </Link>
              <Link
                to="/download-forms"
                className={`px-4 py-2 font-medium ${
                  isScrolled
                    ? "text-white hover:text-blue-200"
                    : "text-white hover:text-blue-200"
                }`}
              >
                {t("downloadForms")}
              </Link>
            </div>
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-6 ml-14 mr-10">
              <LanguageSwitcher />
              <Link
                to="/login"
                className={`px-5 py-1 rounded text-white font-semibold transition-all duration-300 border-2 
                  ${
                    isScrolled
                      ? "border-white text-white text-lg hover:bg-[#f2f6fb] hover:text-[#1e3a5f]"
                      : "border-[#1e3a5f] text-lg text-[#1e3a5f] hover:bg-[#224675] hover:text-white"
                  }
                `}
              >
                {t("login")}
              </Link>
            </div>

            {/* Mobile */}
            <div className="md:hidden mr-2 text-sm">
              <LanguageSwitcher className="text-sm" />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden z-50 relative">
              <button
                className="relative w-8 h-8 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <div className="absolute top-1/2 left-1/2 w-6 transform -translate-x-1/2 -translate-y-1/2">
                  <span
                    className={`absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                      isMenuOpen ? "rotate-45" : "-translate-y-1.5"
                    } ${isScrolled ? "bg-white" : "bg-[#1e3a5f]"}`}
                  ></span>
                  <span
                    className={`absolute h-0.5 w-6 bg-current transform transition-opacity duration-300 ease-in-out ${
                      isMenuOpen ? "opacity-0" : "opacity-100"
                    } ${isScrolled ? "bg-white" : "bg-[#1e3a5f]"}`}
                  ></span>
                  <span
                    className={`absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                      isMenuOpen ? "-rotate-45" : "translate-y-1.5"
                    } ${isScrolled ? "bg-white" : "bg-[#1e3a5f]"}`}
                  ></span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            ref={mobileMenuRef}
            className={`md:hidden fixed top-16 right-0 left-0 bg-[#1e3a5f] rounded-lg mx-4 py-4 transform transition-all duration-300 ease-in-out shadow-xl border border-white/20 ${
              isMenuOpen
                ? "translate-y-0 opacity-100 pointer-events-auto"
                : "-translate-y-4 opacity-0 pointer-events-none"
            }`}
          >
            {[
              { key: "home", path: "/" },
              { key: "about", path: "/about" },
              { key: "announcements", path: "/announcements" },
              { key: "services", path: "/services" },
              { key: "contact", path: "/contact" },
              { key: "downloadForms", path: "/download-forms" },
              { key: "login", path: "/login" },
            ].map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className="block px-6 py-3 text-white rounded hover:bg-white/20 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Divider />
                <Announcements />
                <About />
                <Services />
                <Leaders />
                <Contact />
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/download-forms" element={<DownloadForms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/groupmember" element={<GroupMember />} />
          <Route path="/member-dashboard" element={<MemberDashboard />} />
        </Routes>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;

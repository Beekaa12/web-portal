// App.js
import React, { useState, useEffect, useRef } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
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

const getStoredMemberSession = () => {
  const token = localStorage.getItem("member_token");
  let profile = null;

  try {
    profile = JSON.parse(localStorage.getItem("member_profile") || "null");
  } catch {
    profile = null;
  }

  return { token, profile };
};

const ProtectedMemberRoute = ({ children, allowWhenMustChange = false }) => {
  const memberToken = localStorage.getItem("member_token");
  let memberProfile = null;

  try {
    memberProfile = JSON.parse(
      localStorage.getItem("member_profile") || "null",
    );
  } catch {
    memberProfile = null;
  }

  if (!memberToken) {
    return <Navigate to="/" replace />;
  }

  if (memberProfile?.must_change_password && !allowWhenMustChange) {
    return <Navigate to="/member-dashboard?tab=settings" replace />;
  }

  return children;
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      return true;
    }

    if (savedTheme === "light") {
      return false;
    }

    return false;
  });
  const [memberSession, setMemberSession] = useState(getStoredMemberSession);
  const mobileMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const memberToken = memberSession.token;
  const memberProfile = memberSession.profile;
  const isMemberAuthenticated = Boolean(memberToken);
  const memberDisplayName = memberProfile?.full_name || "Member";
  const memberAvatarUrl =
    memberProfile?.profile_image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(memberDisplayName)}&background=1e3a5f&color=ffffff`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMemberSession(getStoredMemberSession());
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleStorageChange = () =>
      setMemberSession(getStoredMemberSession());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const activeTab = new URLSearchParams(location.search).get("tab");
    const isSettingsView =
      location.pathname === "/member-settings" ||
      (location.pathname === "/member-dashboard" && activeTab === "settings");

    // Read latest storage so same-tab updates after password change are respected.
    const latestSession = getStoredMemberSession();
    const mustChangePassword = Boolean(
      latestSession.token && latestSession.profile?.must_change_password,
    );

    if (mustChangePassword && !isSettingsView) {
      navigate("/member-dashboard?tab=settings", { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("member_token");
    localStorage.removeItem("member_profile");
    setMemberSession({ token: null, profile: null });
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    navigate("/", { replace: true });
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const { t, i18n } = useTranslation();
  const desktopNavLinkClass =
    "px-4 py-2 font-medium text-white hover:text-blue-200";

  const LanguageSwitcher = ({ className }) => (
    <select
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      value={i18n.language}
      className={`bg-transparent text-white px-1 py-1 rounded transition-all duration-300 hover:border hover:bg-[#215487] ${className}`}
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
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? "bg-[#0b1220] text-slate-100" : ""
      }`}
    >
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
              <Link to="/" className={desktopNavLinkClass}>
                {t("home")}
              </Link>
              <Link to="/about" className={desktopNavLinkClass}>
                {t("about")}
              </Link>
              <Link to="/announcements" className={desktopNavLinkClass}>
                {t("announcements")}
              </Link>
              <Link to="/services" className={desktopNavLinkClass}>
                {t("services")}
              </Link>
              <Link to="/contact" className={desktopNavLinkClass}>
                {t("contact")}
              </Link>
              <Link to="/download-forms" className={desktopNavLinkClass}>
                {t("downloadForms")}
              </Link>
            </div>
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-6 ml-14 mr-10">
              <button
                type="button"
                onClick={toggleTheme}
                title={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
                className={`h-9 w-9 inline-flex items-center justify-center rounded-full transition-all duration-300 ${
                  isScrolled
                    ? "border-white text-white hover:bg-[#f2f6fb] hover:text-[#1e3a5f]"
                    : "border-[#1e3a5f] text-white hover:bg-white hover:text-[#1e3a5f]"
                }`}
              >
                {isDarkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364 6.364l.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
              <LanguageSwitcher />
              {isMemberAuthenticated ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                    className="group flex items-center gap-2"
                    title={memberDisplayName}
                  >
                    <img
                      src={memberAvatarUrl}
                      alt={memberDisplayName}
                      className="h-11 w-11 rounded-full object-cover border-2 border-white shadow"
                    />
                    <span className="max-w-[170px] truncate text-sm font-semibold text-white">
                      {memberDisplayName}
                    </span>
                  </button>

                  {isProfileMenuOpen && (
                    <div
                      className={`absolute right-0 mt-3 w-44 rounded-xl border shadow-xl py-2 ${
                        isDarkMode
                          ? "border-slate-500 bg-slate-700"
                          : "border-gray-100 bg-white"
                      }`}
                    >
                      <Link
                        to="/member-dashboard?tab=dashboard"
                        className={`block px-4 py-2 text-sm ${
                          isDarkMode
                            ? "text-slate-100 hover:bg-slate-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        {t("dashboard")}
                      </Link>
                      <Link
                        to="/member-dashboard?tab=profile"
                        className={`block px-4 py-2 text-sm ${
                          isDarkMode
                            ? "text-slate-100 hover:bg-slate-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        {t("profile")}
                      </Link>
                      <Link
                        to="/member-dashboard?tab=settings"
                        className={`block px-4 py-2 text-sm ${
                          isDarkMode
                            ? "text-slate-100 hover:bg-slate-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        {t("Settings")}
                      </Link>
                      <button
                        type="button"
                        className={`w-full text-left px-4 py-2 text-sm ${
                          isDarkMode
                            ? "text-red-300 hover:bg-red-500/25"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                        onClick={handleLogout}
                      >
                        {t("logout")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
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
              )}
            </div>

            {/* Mobile Theme Toggle */}
            <div className="md:hidden mr-2">
              <button
                type="button"
                onClick={toggleTheme}
                title={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
                className={`h-9 w-9 inline-flex items-center justify-center rounded-full transition-all duration-300 ${
                  isScrolled
                    ? "border-white text-white hover:bg-[#f2f6fb] hover:text-[#1e3a5f]"
                    : "border-[#1e3a5f] text-white hover:bg-white hover:text-[#1e3a5f]"
                }`}
              >
                {isDarkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364 6.364l.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
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
              ...(isMemberAuthenticated
                ? [
                    {
                      key: "memberProfile",
                      path: "/member-dashboard?tab=profile",
                      label: t("profile"),
                    },
                    {
                      key: "memberDashboard",
                      path: "/member-dashboard?tab=dashboard",
                      label: t("dashboard"),
                    },
                    {
                      key: "memberSettings",
                      path: "/member-dashboard?tab=settings",
                      label: t("Settings"),
                    },
                  ]
                : [{ key: "login", path: "/login" }]),
            ].map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className="block px-6 py-3 text-white rounded hover:bg-white/20 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label || t(link.key)}
              </Link>
            ))}

            {isMemberAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full text-left px-6 py-3 text-red-200 rounded hover:bg-red-500/30 transition-colors duration-200"
              >
                {t("logout")}
              </button>
            )}
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main
        className={`flex-grow transition-colors duration-300 ${
          isDarkMode ? "bg-slate-700" : ""
        }`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Divider isDarkMode={isDarkMode} />
                <Announcements isDarkMode={isDarkMode} />
                <About isDarkMode={isDarkMode} />
                <Services isDarkMode={isDarkMode} />
                <Leaders isDarkMode={isDarkMode} />
                <Contact isDarkMode={isDarkMode} />
              </>
            }
          />
          <Route path="/about" element={<About isDarkMode={isDarkMode} />} />
          <Route
            path="/announcements"
            element={<Announcements isDarkMode={isDarkMode} />}
          />
          <Route
            path="/download-forms"
            element={<DownloadForms isDarkMode={isDarkMode} />}
          />
          <Route path="/login" element={<Login isDarkMode={isDarkMode} />} />
          <Route
            path="/services"
            element={<Services isDarkMode={isDarkMode} />}
          />
          <Route
            path="/contact"
            element={<Contact isDarkMode={isDarkMode} />}
          />
          <Route
            path="/groupmember"
            element={<GroupMember isDarkMode={isDarkMode} />}
          />
          <Route
            path="/member-profile"
            element={
              <ProtectedMemberRoute>
                <Navigate to="/member-dashboard?tab=profile" replace />
              </ProtectedMemberRoute>
            }
          />
          <Route
            path="/member-dashboard"
            element={
              <ProtectedMemberRoute allowWhenMustChange>
                <MemberDashboard isDarkMode={isDarkMode} />
              </ProtectedMemberRoute>
            }
          />
          <Route
            path="/member-settings"
            element={
              <ProtectedMemberRoute allowWhenMustChange>
                <Navigate to="/member-dashboard?tab=settings" replace />
              </ProtectedMemberRoute>
            }
          />
        </Routes>
      </main>
      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default App;

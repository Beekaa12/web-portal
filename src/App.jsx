// App.js
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Announcements from "./components/Announcements";
import Leaders from "./components/Leaders";
import Contact from "./components/Contact";
import DownloadForms from "./components/DownloadForms";
import Footer from "./components/Footer";

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-[#1e3a5f] shadow-md py-3" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <span
                className={`text-2xl font-bold ${
                  isScrolled ? "text-white" : "text-white"
                }`}
              >
                SACCO
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 font-medium ${
                  isScrolled
                    ? "text-white hover:text-blue-200"
                    : "text-white hover:text-blue-200"
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 font-medium ${
                  isScrolled
                    ? "text-white hover:text-blue-200"
                    : "text-white hover:text-blue-200"
                }`}
              >
                About Us
              </Link>
              <Link
                to="/announcements"
                className={`px-4 py-2 font-medium ${
                  isScrolled
                    ? "text-white hover:text-blue-200"
                    : "text-white hover:text-blue-200"
                }`}
              >
                Announcements
              </Link>
              <Link
                to="/services"
                className={`px-4 py-2 font-medium ${
                  isScrolled
                    ? "text-white hover:text-blue-200"
                    : "text-white hover:text-blue-200"
                }`}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-2 font-medium ${
                  isScrolled
                    ? "text-white hover:text-blue-200"
                    : "text-white hover:text-blue-200"
                }`}
              >
                Contact
              </Link>
              <Link
                to="/download-forms"
                className={`px-4 py-2 font-medium ${
                  isScrolled
                    ? "text-white hover:text-blue-200"
                    : "text-white hover:text-blue-200"
                }`}
              >
                Download Forms
              </Link>
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
              { name: "Home", path: "/" },
              { name: "About Us", path: "/about" },
              { name: "Announcements", path: "/announcements" },
              { name: "Services", path: "/services" },
              { name: "Contact", path: "/contact" },
              { name: "Download Forms", path: "/download-forms" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-6 py-3 text-white rounded hover:bg-white/20 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
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
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          {/* Add Routes if needed  */}
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;

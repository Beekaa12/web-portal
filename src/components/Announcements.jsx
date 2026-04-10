import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
const Announcements = ({ isDarkMode = false }) => {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const timeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now - then) / 1000);

    if (seconds < 60) return "just now";

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (let i = 0; i < intervals.length; i++) {
      const interval = Math.floor(seconds / intervals[i].seconds);
      if (interval >= 1) {
        return `${interval} ${intervals[i].label}${
          interval > 1 ? "s" : ""
        } ago`;
      }
    }

    return "just now";
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/announcements`);
        setAnnouncements(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch announcements.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const openModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Meeting":
        return "bg-blue-100 text-blue-800";
      case "Update":
        return "bg-green-100 text-green-800";
      case "Notice":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const pageBgClass = isDarkMode
    ? "bg-slate-700"
    : "bg-gradient-to-b from-blue-50 to-white";

  const sectionBgClass = isDarkMode ? "bg-[#2f3d52]" : "bg-white";

  const cardClass = isDarkMode
    ? "bg-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full border border-slate-500"
    : "bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full border border-gray-100";

  const timeClass = isDarkMode
    ? "text-sm text-slate-300 font-medium"
    : "text-sm text-gray-500 font-medium";

  const titleClass = isDarkMode
    ? "text-xl font-bold text-slate-100 mb-3 line-clamp-2"
    : "text-xl font-bold text-gray-800 mb-3 line-clamp-2";

  const contentClass = isDarkMode
    ? "text-slate-200 mb-4 line-clamp-3 flex-grow"
    : "text-gray-600 mb-4 line-clamp-3 flex-grow";

  const readMoreClass = isDarkMode
    ? "mt-auto inline-flex items-center text-blue-300 hover:text-blue-200 font-medium group transition-colors"
    : "mt-auto inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group transition-colors";

  const seeMoreBtnClass = isDarkMode
    ? "px-6 py-3 text-blue-200 font-extrabold hover:underline transition-all rounded-lg border border-blue-200 hover:bg-blue-200 hover:text-[#1e3a5f]"
    : "px-6 py-3 text-[#1e3a5f] font-extrabold hover:underline transition-all rounded-lg border border-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white";

  const modalCardClass = isDarkMode
    ? "bg-slate-700 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-500"
    : "bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto";

  const modalCloseBtnClass = isDarkMode
    ? "absolute top-4 right-4 bg-slate-200 rounded-full p-2 hover:bg-white transition-all"
    : "absolute top-4 right-4 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all";

  const modalTimeClass = isDarkMode
    ? "text-sm text-slate-300 font-medium"
    : "text-sm text-gray-500 font-medium";

  const modalTitleClass = isDarkMode
    ? "text-2xl md:text-3xl font-bold text-slate-100 mb-4"
    : "text-2xl md:text-3xl font-bold text-gray-800 mb-4";

  const modalBodyClass = isDarkMode
    ? "prose max-w-none text-slate-100 prose-headings:text-slate-100 prose-strong:text-slate-100 prose-li:text-slate-100"
    : "prose max-w-none text-gray-700";

  const modalFooterClass = isDarkMode
    ? "mt-8 pt-6 border-t border-slate-500"
    : "mt-8 pt-6 border-t border-gray-200";

  const modalFooterTextClass = isDarkMode
    ? "text-sm text-slate-300"
    : "text-sm text-gray-500";

  const modalLinkClass = isDarkMode
    ? "text-blue-300 hover:underline"
    : "text-blue-600 hover:underline";

  if (loading)
    return (
      <p className={`text-center py-16 ${isDarkMode ? "text-slate-100" : ""}`}>
        {t("loadingAnnouncements")}
      </p>
    );
  if (error)
    return (
      <p
        className={`text-center py-16 ${isDarkMode ? "text-red-300" : "text-red-500"}`}
      >
        {error}
      </p>
    );

  const visibleAnnouncements = announcements.slice(0, visibleCount);

  return (
    <div className={pageBgClass}>
      {/* Hero Section */}
      <div className="relative bg-[#1e3b5f] text-white py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("announcementsTitle")}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t("announcementsSubtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className={`py-16 ${sectionBgClass}`}>
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {visibleAnnouncements.map((announcement) => (
              <div
                key={announcement._id || announcement.id}
                className={cardClass}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={announcement.image}
                    alt={announcement.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(
                        announcement.category,
                      )}`}
                    >
                      {announcement.category}
                    </span>
                    <span className={timeClass}>
                      {timeAgo(announcement.createdAt)}
                    </span>
                  </div>
                  <h3 className={titleClass}>{announcement.title}</h3>
                  <p className={contentClass}>{announcement.content}</p>
                  <button
                    onClick={() => openModal(announcement)}
                    className={readMoreClass}
                  >
                    {t("readFull")}
                    <svg
                      className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* See More Button */}
          {visibleCount < announcements.length && (
            <div className="text-center mt-8">
              <button onClick={handleSeeMore} className={seeMoreBtnClass}>
                {t("seeMore")}
              </button>
            </div>
          )}
        </div>

        {/* Announcement Modal */}
        {isModalOpen && selectedAnnouncement && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <div
              className={modalCardClass}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedAnnouncement.image}
                  alt={selectedAnnouncement.title}
                  className="w-full h-full object-cover"
                />
                <button onClick={closeModal} className={modalCloseBtnClass}>
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${getCategoryColor(
                      selectedAnnouncement.category,
                    )}`}
                  >
                    {selectedAnnouncement.category}
                  </span>
                  <span className={modalTimeClass}>
                    {timeAgo(selectedAnnouncement.createdAt)}
                  </span>
                </div>
                <h2 className={modalTitleClass}>
                  {selectedAnnouncement.title}
                </h2>
                <div
                  className={modalBodyClass}
                  dangerouslySetInnerHTML={{
                    __html: selectedAnnouncement.content,
                  }}
                />
                <div className={modalFooterClass}>
                  <p className={modalFooterTextClass}>
                    {t("contactInfo")}{" "}
                    <a href="tel:+254700000000" className={modalLinkClass}>
                      +251 910 000 00
                    </a>{" "}
                    {t("orEmail")}{" "}
                    <a
                      href="mailto:sacco@inu.edu.et"
                      className={modalLinkClass}
                    >
                      sacco@inu.edu.et
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
export default Announcements;

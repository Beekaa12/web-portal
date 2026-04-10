import React, { useState } from "react";
import { useTranslation } from "react-i18next";
const Contact = ({ isDarkMode = false }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit feedback");
      }

      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Hide success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionBgClass = isDarkMode
    ? "bg-gradient-to-b from-slate-800 to-slate-700"
    : "bg-gradient-to-b from-blue-50 to-white";

  const contentBgClass = isDarkMode ? "bg-[#2f3d52]" : "bg-white";

  const cardClass = isDarkMode
    ? "max-w-4xl mx-auto bg-slate-700 border border-slate-500 rounded-xl shadow-lg p-8 md:p-10"
    : "max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-10";

  const labelClass = isDarkMode
    ? "block text-slate-100 font-medium mb-2"
    : "block text-gray-700 font-medium mb-2";

  const inputClass = isDarkMode
    ? "w-full px-4 py-3 rounded-lg border border-slate-400 bg-slate-600 text-slate-50 placeholder-slate-200 focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all hover:border-slate-300"
    : "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300";

  const submitBtnClass = isDarkMode
    ? "w-full md:w-auto px-8 py-3 bg-[#1e3a5f] text-white font-semibold rounded-lg hover:bg-[#16324f] focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all transform hover:-translate-y-0.5"
    : "w-full md:w-auto px-8 py-3 bg-[#1e3a5f] text-white font-semibold rounded-lg hover:bg-[#16324f] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5";

  return (
    <div className={sectionBgClass}>
      {/* Hero Section */}
      <div className="relative bg-[#1e3a5f] text-white py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("contactTitle")}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t("contactSubtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section id="contact" className={`py-16 ${contentBgClass}`}>
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className={cardClass}>
            {isSubmitted && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8 rounded">
                <p className="font-medium">{t("successTitle")}</p>
                <p>{t("successMessage")}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded">
                <p className="font-medium">{t("errorTitle")}</p>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    {t("nameLabel")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder={t("namePlaceholder")}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    {t("emailLabel")}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder={t("emailPlaceholder")}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className={labelClass}>
                  {t("subjectLabel")}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder={t("subjectPlaceholder")}
                />
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>
                  {t("messageLabel")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder={t("messagePlaceholder")}
                  required
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${submitBtnClass} ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("sending")}
                    </span>
                  ) : (
                    t("sendMessage")
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

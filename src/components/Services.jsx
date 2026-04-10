import React from "react";
import { useTranslation } from "react-i18next";

const Services = ({ isDarkMode = false }) => {
  const { t } = useTranslation();
  const sectionBgClass = isDarkMode
    ? "bg-gradient-to-b from-[#2f3d52] to-slate-700"
    : "bg-gradient-to-b from-blue-50 to-white";

  const contentBgClass = isDarkMode ? "bg-[#2f3d52]" : "bg-white";

  const cardClass = isDarkMode
    ? "bg-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full border border-slate-500"
    : "bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full border border-gray-100";

  const titleClass = isDarkMode
    ? "text-xl font-bold text-slate-100 mb-3"
    : "text-xl font-bold text-gray-800 mb-3";

  const descriptionClass = isDarkMode
    ? "text-slate-200 mb-4"
    : "text-gray-700 mb-4";

  const featureTextClass = isDarkMode
    ? "text-slate-200 group-hover:text-blue-300 transition-colors"
    : "text-gray-700 group-hover:text-blue-600 transition-colors";

  const learnMoreClass = isDarkMode
    ? "text-blue-300 font-medium hover:text-blue-200 transition-colors flex items-center group"
    : "text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center group";

  const services = [
    {
      titleKey: "servicesSavingsTitle",
      descriptionKey: "servicesSavingsDescription",
      icon: (
        <svg
          className="w-10 h-10 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      featuresKeys: [
        "servicesSavingsFeature1",
        "servicesSavingsFeature2",
        "servicesSavingsFeature3",
        "servicesSavingsFeature4",
      ],
    },
    {
      titleKey: "servicesLoansTitle",
      descriptionKey: "servicesLoansDescription",
      icon: (
        <svg
          className="w-10 h-10 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
      ),
      featuresKeys: [
        "servicesLoansFeature1",
        "servicesLoansFeature2",
        "servicesLoansFeature3",
        "servicesLoansFeature4",
      ],
    },
    {
      titleKey: "servicesInvestmentsTitle",
      descriptionKey: "servicesInvestmentsDescription",
      icon: (
        <svg
          className="w-10 h-10 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      featuresKeys: [
        "servicesInvestmentsFeature1",
        "servicesInvestmentsFeature2",
        "servicesInvestmentsFeature3",
        "servicesInvestmentsFeature4",
      ],
    },
    {
      titleKey: "servicesAdvisoryTitle",
      descriptionKey: "servicesAdvisoryDescription",
      icon: (
        <svg
          className="w-10 h-10 text-teal-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      featuresKeys: [
        "servicesAdvisoryFeature1",
        "servicesAdvisoryFeature2",
        "servicesAdvisoryFeature3",
        "servicesAdvisoryFeature4",
      ],
    },
    {
      titleKey: "servicesInsuranceTitle",
      descriptionKey: "servicesInsuranceDescription",
      icon: (
        <svg
          className="w-10 h-10 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      featuresKeys: [
        "servicesInsuranceFeature1",
        "servicesInsuranceFeature2",
        "servicesInsuranceFeature3",
        "servicesInsuranceFeature4",
      ],
    },
  ];

  return (
    <div className={sectionBgClass}>
      {/* Hero Section */}
      <div className="relative bg-[#1e3a5f] text-white py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("servicesPageTitle")}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t("servicesPageSubtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className={`py-16 ${contentBgClass}`}>
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className={cardClass}>
                <div className="p-6 flex-grow">
                  <div
                    className="w-16 h-16 bg-opacity-20 rounded-full flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: `${service.icon.props.className.includes("text-") ? service.icon.props.className.split("text-")[1].split(" ")[0].replace("-500", "-100").replace("-600", "-100") : "bg-blue-100"}`,
                    }}
                  >
                    {service.icon}
                  </div>
                  <h3 className={titleClass}>{t(service.titleKey)}</h3>
                  <p className={descriptionClass}>
                    {t(service.descriptionKey)}
                  </p>
                  <ul className="space-y-3 mt-5">
                    {service.featuresKeys.map((featureKey, i) => (
                      <li key={i} className="flex items-start group">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 mr-3 rounded-full flex-shrink-0 ${
                            isDarkMode ? "bg-slate-600" : "bg-blue-50"
                          }`}
                        >
                          <svg
                            className={`w-4 h-4 ${
                              isDarkMode ? "text-blue-300" : "text-blue-600"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <span className={featureTextClass}>
                          {t(featureKey)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 pb-6">
                  <button className={learnMoreClass}>
                    {t("servicesLearnMore")}
                    <svg
                      className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
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
        </div>
      </section>
    </div>
  );
};

export default Services;

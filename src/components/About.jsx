import React from "react";
import { useTranslation } from "react-i18next";
const About = ({ isDarkMode = false }) => {
  const { t } = useTranslation();

  const pageBgClass = isDarkMode
    ? "bg-gradient-to-b from-[#2f3d52] to-slate-700"
    : "bg-gradient-to-b from-blue-50 to-white";

  const sectionBgClass = isDarkMode ? "bg-[#2f3d52]" : "bg-white";

  const storyCardClass = isDarkMode
    ? "bg-slate-700 border border-slate-500 p-6 rounded-xl shadow-lg"
    : "bg-white p-6 rounded-xl shadow-lg";

  const sectionTitleClass = isDarkMode
    ? "text-3xl font-bold text-slate-100 mb-6"
    : "text-3xl font-bold text-[#1e3a5f] mb-6";

  const storyTextClass = isDarkMode
    ? "space-y-4 text-slate-200"
    : "space-y-4 text-gray-700";

  const missionCardClass = isDarkMode
    ? "bg-slate-700 p-8 rounded-xl border border-slate-500 hover:shadow-lg transition-shadow"
    : "bg-[#f8fafc] p-8 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow";

  const missionTextClass = isDarkMode ? "text-slate-200" : "text-gray-600";

  const coreHeadingClass = isDarkMode
    ? "text-3xl font-bold text-slate-100 mb-2"
    : "text-3xl font-bold text-[#1e3a5f] mb-2";

  const valueCardClass = isDarkMode
    ? "bg-slate-700 border border-slate-500 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
    : "bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow";

  const valueIconWrapClass = isDarkMode
    ? "bg-slate-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
    : "bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4";

  const valueTitleClass = isDarkMode
    ? "text-xl font-semibold text-slate-100 mb-2"
    : "text-xl font-semibold text-[#1e3a5f] mb-2";

  const valueTextClass = isDarkMode ? "text-slate-200" : "text-gray-600";

  const ctaButtonClass = isDarkMode
    ? "bg-slate-100 text-[#1e3a5f] font-semibold px-8 py-3 rounded-full hover:bg-white transition-colors"
    : "bg-white text-blue-700 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors";

  return (
    <div className={pageBgClass}>
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
            {t("aboutUsTitle")}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t("aboutUsSubtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className={`py-16 ${sectionBgClass}`}>
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          {/* Our Story */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1">
              <div className={storyCardClass}>
                <h2 className={sectionTitleClass}>{t("aboutStoryTitle")}</h2>
                <div className={storyTextClass}>
                  <p>{t("aboutStoryP1")}</p>
                  <p>{t("aboutStoryP2")}</p>
                  <p>{t("aboutStoryP3")}</p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                alt={t("aboutTeamMeetingAlt")}
                className="w-full h-auto rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Our Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className={missionCardClass}>
              <div className="text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3
                className={sectionTitleClass
                  .replace("text-3xl", "text-2xl")
                  .replace("mb-6", "mb-4")}
              >
                {t("aboutMissionTitle")}
              </h3>
              <p className={missionTextClass}>{t("aboutMissionText")}</p>
            </div>

            <div className={missionCardClass}>
              <div className="text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3
                className={sectionTitleClass
                  .replace("text-3xl", "text-2xl")
                  .replace("mb-6", "mb-4")}
              >
                {t("aboutVisionTitle")}
              </h3>
              <p className={missionTextClass}>{t("aboutVisionText")}</p>
            </div>
          </div>

          {/* Core Values */}
          <div className="text-center mb-16">
            <h2 className={coreHeadingClass}>{t("aboutCoreValuesTitle")}</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-12"></div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: t("aboutValueIntegrityTitle"),
                  description: t("aboutValueIntegrityDescription"),
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                },
                {
                  title: t("aboutValueExcellenceTitle"),
                  description: t("aboutValueExcellenceDescription"),
                  icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z",
                },
                {
                  title: t("aboutValueInnovationTitle"),
                  description: t("aboutValueInnovationDescription"),
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                },
                {
                  title: t("aboutValueTeamworkTitle"),
                  description: t("aboutValueTeamworkDescription"),
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                },
                {
                  title: t("aboutValueSocialResponsibilityTitle"),
                  description: t("aboutValueSocialResponsibilityDescription"),
                  icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                },
                {
                  title: t("aboutValueMemberFocusTitle"),
                  description: t("aboutValueMemberFocusDescription"),
                  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                },
              ].map((value, index) => (
                <div key={index} className={valueCardClass}>
                  <div className={valueIconWrapClass}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={value.icon}
                      />
                    </svg>
                  </div>
                  <h3 className={valueTitleClass}>{value.title}</h3>
                  <p className={valueTextClass}>{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Join Us CTA */}
          <div className="bg-gradient-to-r from-[#1e505f] to-[#1e3a5f] rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">{t("aboutJoinTitle")}</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {t("aboutJoinText")}
            </p>
            <button className={ctaButtonClass}>{t("aboutJoinButton")}</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

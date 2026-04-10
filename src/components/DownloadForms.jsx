import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const DownloadForms = ({ isDarkMode = false }) => {
  const { t } = useTranslation();
  const [selectedForm, setSelectedForm] = useState(null);

  const sectionBgClass = isDarkMode
    ? "bg-gradient-to-b from-slate-800 to-slate-700"
    : "bg-gradient-to-b from-blue-50 to-white";

  const contentBgClass = isDarkMode ? "bg-[#2f3d52]" : "bg-white";

  const cardClass = isDarkMode
    ? "bg-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col border border-slate-500"
    : "bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col border border-gray-100";

  const titleClass = isDarkMode
    ? "text-xl font-bold text-slate-100 mb-2"
    : "text-xl font-bold text-gray-800 mb-2";

  const descriptionClass = isDarkMode
    ? "text-slate-200 mb-4"
    : "text-gray-600 mb-4";

  const fileLabelClass = isDarkMode
    ? "text-sm text-slate-300"
    : "text-sm text-gray-500";

  const emptyStateClass = isDarkMode
    ? "md:col-span-2 lg:col-span-2 bg-amber-100/20 border border-amber-300/30 rounded-xl p-6 text-amber-100"
    : "md:col-span-2 lg:col-span-2 bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-800";

  const noteCardClass = isDarkMode
    ? "mt-12 bg-slate-700 border-l-4 border-blue-400 p-4 rounded-r"
    : "mt-12 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r";

  const noteTextClass = isDarkMode
    ? "text-sm text-slate-100"
    : "text-sm text-blue-700";

  const modalCardClass = isDarkMode
    ? "w-full max-w-5xl bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-600"
    : "w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden";

  const modalHeaderClass = isDarkMode
    ? "px-5 py-4 border-b border-slate-600 flex items-center justify-between"
    : "px-5 py-4 border-b border-gray-200 flex items-center justify-between";

  const modalTitleClass = isDarkMode
    ? "text-lg font-semibold text-slate-100"
    : "text-lg font-semibold text-gray-800";

  const closeIconClass = isDarkMode
    ? "text-slate-300 hover:text-white"
    : "text-gray-500 hover:text-gray-700";

  const previewBodyClass = isDarkMode
    ? "h-[65vh] bg-slate-900"
    : "h-[65vh] bg-gray-100";

  const modalFooterClass = isDarkMode
    ? "px-5 py-4 border-t border-slate-600 flex justify-end gap-3"
    : "px-5 py-4 border-t border-gray-200 flex justify-end gap-3";

  const closeBtnClass = isDarkMode
    ? "px-4 py-2 rounded-lg border border-slate-400 text-slate-100 hover:bg-slate-700"
    : "px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50";

  const actionBtnClass = isDarkMode
    ? "px-4 py-2 rounded-lg bg-[#1e3a5f] text-white hover:bg-[#16324f] focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-slate-800"
    : "px-4 py-2 rounded-lg bg-[#1e3a5f] text-white hover:bg-[#16324f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:ring-offset-2";

  const forms = useMemo(() => {
    const pdfModules = import.meta.glob("../assets/forms/*.pdf", {
      eager: true,
      import: "default",
    });

    return Object.entries(pdfModules).map(([path, fileUrl], index) => {
      const fileName = decodeURIComponent(path.split("/").pop() || "form.pdf");
      const readableTitle = fileName
        .replace(/\.pdf$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      return {
        id: index + 1,
        title: readableTitle,
        fileName,
        fileUrl,
        iconColor:
          index % 3 === 0
            ? "text-blue-600"
            : index % 3 === 1
              ? "text-green-600"
              : "text-purple-600",
      };
    });
  }, []);

  const handleOpenPreview = (form) => {
    setSelectedForm(form);
  };

  const handleDownload = (form) => {
    const link = document.createElement("a");
    link.href = form.fileUrl;
    link.download = form.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={sectionBgClass}>
      {/* Hero Section */}
      <div className="relative bg-[#1e3a5f] text-white py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("downloadPageTitle")}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t("downloadPageSubtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className={`py-16 ${contentBgClass}`}>
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {forms.length === 0 && (
              <div className={emptyStateClass}>{t("downloadNoForms")}</div>
            )}

            {forms.map((form) => (
              <div key={form.id} className={cardClass}>
                <div className="p-6 flex-grow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className={`w-12 h-12 ${form.iconColor}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className={titleClass}>{form.title}</h3>
                      <p className={descriptionClass}>
                        {t("downloadCardDescription")}
                      </p>
                      <p className={fileLabelClass}>
                        {t("downloadFileLabel")}: {form.fileName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <button
                    onClick={() => handleOpenPreview(form)}
                    className="w-full px-6 py-3 bg-[#1e3a5f] text-white font-medium rounded-lg hover:bg-[#16324f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:ring-offset-2 transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    {t("downloadPreviewButton")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={noteCardClass}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className={`h-5 w-5 ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className={noteTextClass}>
                  <span className="font-medium">{t("downloadNoteLabel")}</span>{" "}
                  {t("downloadNoteText")}{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className={modalCardClass}>
            <div className={modalHeaderClass}>
              <h3 className={modalTitleClass}>
                {t("downloadPreviewTitle")}: {selectedForm.title}
              </h3>
              <button
                onClick={() => setSelectedForm(null)}
                className={closeIconClass}
                aria-label={t("downloadClosePreview")}
              >
                ✕
              </button>
            </div>

            <div className={previewBodyClass}>
              <iframe
                title={selectedForm.title}
                src={`${selectedForm.fileUrl}#toolbar=1`}
                className="w-full h-full"
              />
            </div>

            <div className={modalFooterClass}>
              <button
                onClick={() => setSelectedForm(null)}
                className={closeBtnClass}
              >
                {t("downloadClosePreview")}
              </button>
              <button
                onClick={() => handleDownload(selectedForm)}
                className={actionBtnClass}
              >
                {t("downloadNowButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadForms;

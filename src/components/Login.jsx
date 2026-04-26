import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_BASE = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

const Login = ({ isDarkMode = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const sectionBgClass = isDarkMode
    ? "bg-[#2f3d52] min-h-screen"
    : "bg-gradient-to-b from-blue-50 to-white min-h-screen";

  const cardClass = isDarkMode
    ? "max-w-md mx-auto bg-slate-700 rounded-xl shadow-lg border border-slate-500 p-8"
    : "max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8";

  const headingClass = isDarkMode
    ? "text-2xl font-bold text-center text-slate-100 mb-2"
    : "text-2xl font-bold text-center text-gray-800 mb-2";

  const subtitleClass = isDarkMode
    ? "text-center text-slate-200 mb-6"
    : "text-center text-gray-500 mb-6";

  const labelClass = isDarkMode
    ? "block text-sm font-medium text-slate-100 mb-1"
    : "block text-sm font-medium text-gray-700 mb-1";

  const inputClass = isDarkMode
    ? "w-full px-4 py-2 border border-slate-400 bg-slate-600 text-slate-50 placeholder-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
    : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]";

  const helperTextClass = isDarkMode
    ? "mt-6 text-center text-sm text-slate-200"
    : "mt-6 text-center text-sm text-gray-500";

  const handleChange = (e) => {
    if (loginError) {
      setLoginError("");
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setLoginError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/member/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : null;

      if (!res.ok) {
        setLoginError(data?.message || t("loginInvalidCredentials"));
        return;
      }

      if (!data?.token) {
        setLoginError(t("loginTokenMissing"));
        return;
      }

      localStorage.setItem("member_token", data.token);
      localStorage.setItem("member_profile", JSON.stringify(data.member || {}));

      if (data?.member?.must_change_password) {
        navigate("/member-settings");
      } else {
        navigate("/member-dashboard");
      }
    } catch (error) {
      console.error("Member login error:", error);
      setLoginError(t("loginNetworkError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={sectionBgClass}>
      {/* Hero Section */}
      <div className="relative bg-[#1e3a5f] text-white py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("loginHeroTitle")}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t("loginHeroSubtitle")}
          </p>
        </div>
      </div>

      {/* Login Card */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className={cardClass}>
            <h2 className={headingClass}>{t("loginWelcomeTitle")}</h2>
            <p className={subtitleClass}>{t("loginWelcomeSubtitle")}</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>
                  {t("loginIdentifierLabel")}
                </label>
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder={t("loginIdentifierPlaceholder")}
                />
              </div>

              <div>
                <label className={labelClass}>{t("loginPasswordLabel")}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-6 py-3 bg-[#1e3a5f] text-white font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:ring-offset-2 transition"
              >
                {isLoading ? t("loginSigningIn") : t("loginSignIn")}
              </button>

              {loginError && (
                <p className="text-sm text-red-600 font-medium">{loginError}</p>
              )}
            </form>

            {/* Footer Note */}
            <div className={helperTextClass}>
              {t("loginTrouble")}{" "}
              <span 
                className="text-[#1e3a5f] font-medium cursor-pointer hover:underline"
                onClick={() => setShowSupportModal(true)}
              >
                {t("loginContactSupport")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className={`max-w-md w-full rounded-xl p-6 relative ${
            isDarkMode 
              ? 'bg-slate-700 border border-slate-500' 
              : 'bg-white border border-gray-200'
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setShowSupportModal(false)}
              className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full ${
                isDarkMode 
                  ? 'hover:bg-slate-600 text-slate-200' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              
              <h3 className={`text-xl font-semibold mb-3 ${
                isDarkMode ? 'text-slate-100' : 'text-gray-800'
              }`}>
                Need Support?
              </h3>
              
              <p className={`mb-6 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Please contact our manager office for assistance with your account or any technical issues.
              </p>
              
              <div className={`rounded-lg p-4 mb-6 ${
                isDarkMode ? 'bg-slate-600' : 'bg-gray-50'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className={isDarkMode ? 'text-slate-200' : 'text-gray-700'}>
                      +251 910-00-0000
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className={isDarkMode ? 'text-slate-200' : 'text-gray-700'}>
                      manager@gmail.com
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={isDarkMode ? 'text-slate-200' : 'text-gray-700'}>
                      Mon-Fri: 9:00 AM - 6:00 PM
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowSupportModal(false)}
                className="w-full px-6 py-3 bg-[#1e3a5f] text-white font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:ring-offset-2 transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

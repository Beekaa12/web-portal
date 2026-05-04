import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Help from "./Help";

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
  const [showPassword, setShowPassword] = useState(false);

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

  const passwordToggleClass = isDarkMode
    ? "absolute inset-y-0 right-3 flex items-center text-slate-200 hover:text-white"
    : "absolute inset-y-0 right-3 flex items-center text-slate-600 hover:text-slate-900";

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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`${inputClass} pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className={passwordToggleClass}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword
                        ? t("loginHidePassword")
                        : t("loginShowPassword")
                    }
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M2 12s3.5-7 10-7c2.1 0 3.9.6 5.4 1.4" />
                        <path d="M22 12s-3.5 7-10 7c-2.1 0-3.9-.6-5.4-1.4" />
                        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                        <path d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
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

      {/* Help Modal */}
      <Help
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
};

export default Login;

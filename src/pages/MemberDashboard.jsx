import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const toSavingLabel = (savingType = "") =>
  savingType
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" + ") || "-";

const getInitials = (fullName = "") => {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "U";
  }
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || "" : "";
  return `${first}${last}`.toUpperCase();
};

const MemberDashboard = ({ isDarkMode = false }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const currentTab = searchParams.get("tab") || "dashboard";
  const activeTab = ["dashboard", "profile", "settings"].includes(currentTab)
    ? currentTab
    : "dashboard";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [savingsTransactions, setSavingsTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState("");
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [imageSuccess, setImageSuccess] = useState("");

  const memberProfile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("member_profile") || "null") || {};
    } catch {
      return {};
    }
  }, []);

  const [mustChangePassword, setMustChangePassword] = useState(
    Boolean(memberProfile?.must_change_password),
  );

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("member_token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE}/api/members/me/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const contentType = response.headers.get("content-type") || "";
        const payload = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("member_token");
          localStorage.removeItem("member_profile");
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(
            payload?.message || t("memberDashboardLoadDataFailed"),
          );
        }

        setDashboardData(payload?.data || null);
      } catch (fetchError) {
        console.error("Error loading member dashboard:", fetchError);
        setError(fetchError.message || t("memberDashboardUnableLoadData"));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  useEffect(() => {
    const memberId = Number(
      dashboardData?.member?.id || memberProfile?.id || 0,
    );
    const token = localStorage.getItem("member_token");

    if (!memberId || !token) {
      return;
    }

    const fetchSavingsHistory = async () => {
      try {
        setTransactionsLoading(true);
        setTransactionsError("");

        const response = await fetch(
          `${API_BASE}/api/savings/member/${memberId}/transactions?limit=1000`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          },
        );

        const contentType = response.headers.get("content-type") || "";
        const payload = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("member_token");
          localStorage.removeItem("member_profile");
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok || payload?.success === false) {
          throw new Error(
            payload?.message || t("memberDashboardLoadSavingsFailed"),
          );
        }

        setSavingsTransactions(
          Array.isArray(payload?.data) ? payload.data : [],
        );
      } catch (historyError) {
        console.error("Error loading savings history:", historyError);
        setSavingsTransactions([]);
        setTransactionsError(
          historyError.message || t("memberDashboardUnableLoadSavings"),
        );
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchSavingsHistory();
  }, [dashboardData?.member?.id, memberProfile?.id, navigate]);

  const handleTabChange = (tab) => {
    if (tab === "dashboard") {
      setSearchParams({}, { replace: true });
      return;
    }

    setSearchParams({ tab }, { replace: true });
  };

  const handleSettingsInputChange = (e) => {
    setFormError("");
    setFormSuccess("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileFileChange = (e) => {
    setImageError("");
    setImageSuccess("");
    const file = e.target.files?.[0] || null;
    setSelectedProfileFile(file);
  };

  const handleProfileImageUpload = async (e) => {
    e.preventDefault();

    if (!selectedProfileFile) {
      setImageError(t("memberDashboardChooseImageFirst"));
      return;
    }

    try {
      setImageUploading(true);
      setImageError("");
      setImageSuccess("");

      const token = localStorage.getItem("member_token");
      const uploadData = new FormData();
      uploadData.append("profile_image", selectedProfileFile);

      const response = await fetch(`${API_BASE}/api/members/me/profile-image`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: uploadData,
      });

      const payload = await response.json().catch(() => null);

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("member_token");
        localStorage.removeItem("member_profile");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          payload?.message || t("memberDashboardUpdateImageFailed"),
        );
      }

      const nextImageUrl = payload?.member?.profile_image || "";

      setDashboardData((prev) => ({
        ...(prev || {}),
        member: {
          ...(prev?.member || {}),
          profile_image: nextImageUrl,
        },
      }));

      let latestProfile = {};
      try {
        latestProfile =
          JSON.parse(localStorage.getItem("member_profile") || "null") || {};
      } catch {
        latestProfile = {};
      }

      localStorage.setItem(
        "member_profile",
        JSON.stringify({
          ...latestProfile,
          profile_image: nextImageUrl,
        }),
      );

      setSelectedProfileFile(null);
      setImageSuccess(t("memberDashboardImageUpdatedSuccess"));
    } catch (uploadError) {
      setImageError(
        uploadError.message || t("memberDashboardImageUpdateFailed"),
      );
    } finally {
      setImageUploading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (formData.new_password.length < 8) {
      setFormError(t("memberDashboardPasswordMinLength"));
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setFormError(t("memberDashboardPasswordMismatch"));
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      setFormSuccess("");

      const token = localStorage.getItem("member_token");
      const response = await fetch(
        `${API_BASE}/api/auth/member/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.message || t("memberDashboardPasswordChangeFailed"),
        );
      }

      let latestProfile = {};
      try {
        latestProfile =
          JSON.parse(localStorage.getItem("member_profile") || "null") || {};
      } catch {
        latestProfile = {};
      }

      const updatedProfile = {
        ...latestProfile,
        must_change_password: false,
      };
      localStorage.setItem("member_profile", JSON.stringify(updatedProfile));
      setMustChangePassword(false);

      setFormSuccess(t("memberDashboardPasswordChangedSuccess"));
      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setTimeout(() => {
        handleTabChange("dashboard");
      }, 800);
    } catch (submitError) {
      setFormError(
        submitError.message || t("memberDashboardPasswordChangeError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const member = dashboardData?.member || {};
  const summary = dashboardData?.summary || {
    compulsoryBalance: 0,
    voluntaryBalance: 0,
    totalBalance: 0,
    loanAmount: 0,
    loanOutstanding: 0,
    loanStatus: t("memberDashboardNoActiveLoan"),
  };
  const savingsHistory = savingsTransactions;

  const pageBgClass = isDarkMode
    ? "min-h-screen bg-gradient-to-b from-[#2f3d52] to-slate-700"
    : "min-h-screen bg-gradient-to-b from-blue-50 to-white";

  const contentSectionClass = isDarkMode ? "bg-[#2f3d52]" : "";

  const panelClass = isDarkMode
    ? "bg-slate-700 rounded-2xl border border-slate-500 shadow-md p-6 md:p-8"
    : "bg-white rounded-2xl border border-gray-100 shadow-md p-6 md:p-8";

  const statCardClass = isDarkMode
    ? "bg-slate-700 rounded-xl border border-slate-500 shadow-sm p-6"
    : "bg-white rounded-xl border border-gray-100 shadow-sm p-6";

  const titleTextClass = isDarkMode
    ? "text-xl font-bold text-slate-100"
    : "text-xl font-bold text-gray-800";

  const subtitleTextClass = isDarkMode ? "text-slate-200" : "text-gray-600";

  const softBadgeClass = isDarkMode
    ? "inline-flex items-center px-3 py-1 rounded-full bg-slate-600 text-blue-200 text-sm font-semibold border border-slate-400"
    : "inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-[#1e3a5f] text-sm font-semibold border border-blue-200";

  const tableHeadClass = isDarkMode
    ? "border-b border-slate-500 text-sm text-slate-200"
    : "border-b border-gray-200 text-sm text-gray-500";

  const tableRowClass = isDarkMode
    ? "border-b border-slate-600 text-slate-100"
    : "border-b border-gray-100 text-gray-700";

  const inputClass = isDarkMode
    ? "w-full px-4 py-2 border border-slate-500 bg-slate-600 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
    : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]";

  const accentTextClass = isDarkMode ? "text-blue-200" : "text-[#1e3a5f]";
  const amountTextClass = isDarkMode ? "text-slate-100" : "text-[#1e3a5f]";

  const profileLabel = `${member.full_name || t("memberLabel")} ${t("profile")}`;
  const profileInitials = getInitials(member.full_name || t("memberLabel"));
  const avatarBaseClass = isDarkMode
    ? "bg-slate-600 text-slate-100"
    : "bg-blue-100 text-[#1e3a5f]";

  if (loading) {
    return (
      <div className={`${pageBgClass} flex items-center justify-center`}>
        <div className="text-center">
          <div
            className={`h-12 w-12 mx-auto rounded-full border-4 animate-spin ${
              isDarkMode
                ? "border-slate-500 border-t-slate-100"
                : "border-blue-200 border-t-[#1e3a5f]"
            }`}
          />
          <p
            className={`mt-4 ${isDarkMode ? "text-slate-200" : "text-gray-600"}`}
          >
            {t("memberDashboardLoading")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${pageBgClass} flex items-center justify-center p-4`}>
        <div
          className={`max-w-md w-full rounded-xl p-6 text-center border ${
            isDarkMode
              ? "bg-slate-700 border-red-400"
              : "bg-white border-red-200"
          }`}
        >
          <h2 className="text-xl font-semibold text-red-700">
            {t("memberDashboardUnableLoadTitle")}
          </h2>
          <p
            className={`mt-2 ${isDarkMode ? "text-slate-200" : "text-gray-600"}`}
          >
            {error}
          </p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="mt-5 px-4 py-2 rounded-lg bg-[#1e3a5f] text-white"
          >
            {t("memberDashboardBackToLogin")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={pageBgClass}>
      <section className="relative bg-[#1e3a5f] text-white py-20">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url('https://cdn-icons-png.flaticon.com/512/1077/1077114.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("memberDashboardTitle")}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t("memberDashboardSubtitle")}
          </p>
        </div>
      </section>

      <section className={`py-12 mx-auto md:mx-8 ${contentSectionClass}`}>
        <div className="container mx-auto px-4 space-y-8">
          {activeTab === "dashboard" && (
            <>
              <div className={panelClass}>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {member.profile_image ? (
                    <img
                      src={member.profile_image}
                      alt={profileLabel}
                      className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
                    />
                  ) : (
                    <div
                      role="img"
                      aria-label={profileLabel}
                      className={`w-28 h-28 rounded-full border-4 border-blue-100 flex items-center justify-center text-3xl font-semibold ${avatarBaseClass}`}
                    >
                      {profileInitials}
                    </div>
                  )}

                  <div className="space-y-2">
                    <h2
                      className={`text-2xl font-bold ${
                        isDarkMode ? "text-slate-100" : "text-gray-800"
                      }`}
                    >
                      {member.full_name || t("memberLabel")}
                    </h2>
                    <p className={subtitleTextClass}>
                      {t("memberDashboardEmployeeId")}:{" "}
                      {member.employee_id || "-"}
                    </p>
                    <p className={softBadgeClass}>
                      {t("memberDashboardSavingType")}:{" "}
                      {toSavingLabel(member.saving_type)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <article className={statCardClass}>
                  <p
                    className={`text-sm mb-2 ${
                      isDarkMode ? "text-slate-200" : "text-gray-500"
                    }`}
                  >
                    {t("memberDashboardCompulsorySaving")}
                  </p>
                  <h3 className={`text-2xl font-bold ${amountTextClass}`}>
                    {formatCurrency(summary.compulsoryBalance)}
                  </h3>
                </article>

                <article className={statCardClass}>
                  <p
                    className={`text-sm mb-2 ${
                      isDarkMode ? "text-slate-200" : "text-gray-500"
                    }`}
                  >
                    {t("memberDashboardVoluntarySaving")}
                  </p>
                  <h3 className={`text-2xl font-bold ${amountTextClass}`}>
                    {formatCurrency(summary.voluntaryBalance)}
                  </h3>
                </article>

                <article className={statCardClass}>
                  <p
                    className={`text-sm mb-2 ${
                      isDarkMode ? "text-slate-200" : "text-gray-500"
                    }`}
                  >
                    {t("memberDashboardTotalSavingBalance")}
                  </p>
                  <h3 className={`text-2xl font-bold ${amountTextClass}`}>
                    {formatCurrency(summary.totalBalance)}
                  </h3>
                </article>

                <article className={statCardClass}>
                  <p
                    className={`text-sm mb-2 ${
                      isDarkMode ? "text-slate-200" : "text-gray-500"
                    }`}
                  >
                    {t("memberDashboardTotalShareAmount")}
                  </p>
                  <h3 className={`text-2xl font-bold ${amountTextClass}`}>
                    {formatCurrency(member.share_amount)}
                  </h3>
                </article>
              </div>

              <div className={panelClass}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h3 className={titleTextClass}>
                    {t("memberDashboardLoanSummary")}
                  </h3>
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200 w-fit">
                    {summary.loanStatus}
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className={subtitleTextClass}>
                      {t("memberDashboardAmountOfLoan")}
                    </p>
                    <p className={`text-3xl font-bold mt-1 ${amountTextClass}`}>
                      {formatCurrency(summary.loanAmount)}
                    </p>
                  </div>
                  <div>
                    <p className={subtitleTextClass}>
                      {t("memberDashboardRestLoan")}
                    </p>
                    <p className="text-3xl font-bold text-amber-700 mt-1">
                      {formatCurrency(summary.loanOutstanding)}
                    </p>
                  </div>
                </div>
              </div>

              <div className={panelClass}>
                <h3 className={`${titleTextClass} mb-5`}>
                  {t("memberDashboardSavingHistoryTrack")}
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left">
                    <thead>
                      <tr className={tableHeadClass}>
                        <th className="py-3 pr-4">
                          {t("memberDashboardDate")}
                        </th>
                        <th className="py-3 px-4">
                          {t("memberDashboardSavingType")}
                        </th>
                        <th className="py-3 px-4">
                          {t("memberDashboardDeposit")}
                        </th>
                        <th className="py-3 px-4">
                          {t("memberDashboardWithdrawal")}
                        </th>
                        <th className="py-3 px-4">
                          {t("memberDashboardInterest")}
                        </th>
                        <th className="py-3 px-4">{t("memberDashboardNet")}</th>
                        <th className="py-3 pl-4">
                          {t("memberDashboardStatus")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionsLoading && (
                        <tr>
                          <td
                            className={`py-6 text-center ${
                              isDarkMode ? "text-slate-200" : "text-gray-500"
                            }`}
                            colSpan={7}
                          >
                            {t("memberDashboardLoadingSavingsHistory")}
                          </td>
                        </tr>
                      )}

                      {!transactionsLoading &&
                        savingsHistory.map((item) => {
                          const deposit = Number(item.deposit_amount || 0);
                          const withdrawal = Number(
                            item.withdrawal_amount || 0,
                          );
                          const interest = Number(item.interest_amount || 0);
                          const net = deposit + interest - withdrawal;
                          const savingType = String(item.saving_type || "-");
                          const normalizedType =
                            savingType.charAt(0).toUpperCase() +
                            savingType.slice(1).toLowerCase();

                          return (
                            <tr key={item.id} className={tableRowClass}>
                              <td className="py-3 pr-4 font-medium">
                                {formatDate(
                                  item.record_date || item.created_at,
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                    isDarkMode
                                      ? "bg-slate-600 text-blue-200 border-slate-400"
                                      : "bg-blue-50 text-[#1e3a5f] border-blue-200"
                                  }`}
                                >
                                  {normalizedType}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {formatCurrency(deposit)}
                              </td>
                              <td className="py-3 px-4">
                                {formatCurrency(withdrawal)}
                              </td>
                              <td className="py-3 px-4">
                                {formatCurrency(interest)}
                              </td>
                              <td className="py-3 px-4 font-semibold">
                                {formatCurrency(net)}
                              </td>
                              <td className="py-3 pl-4">
                                <span
                                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                    net >= 0
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-amber-50 text-amber-700 border-amber-200"
                                  }`}
                                >
                                  {net >= 0
                                    ? t("memberDashboardRecorded")
                                    : t("memberDashboardAdjusted")}
                                </span>
                              </td>
                            </tr>
                          );
                        })}

                      {!transactionsLoading && transactionsError && (
                        <tr>
                          <td
                            className="py-6 text-center text-red-600"
                            colSpan={7}
                          >
                            {transactionsError}
                          </td>
                        </tr>
                      )}

                      {!transactionsLoading &&
                        !transactionsError &&
                        savingsHistory.length === 0 && (
                          <tr>
                            <td
                              className={`py-6 text-center ${
                                isDarkMode ? "text-slate-200" : "text-gray-500"
                              }`}
                              colSpan={7}
                            >
                              {t("memberDashboardNoSavingsHistory")}
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "profile" && (
            <div className={panelClass}>
              <div
                className={`flex flex-col md:flex-row md:items-center gap-6 pb-6 mb-6 border-b ${
                  isDarkMode ? "border-slate-500" : "border-gray-100"
                }`}
              >
                {member.profile_image ? (
                  <img
                    src={member.profile_image}
                    alt={member.full_name || t("memberLabel")}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={member.full_name || t("memberLabel")}
                    className={`w-24 h-24 rounded-full border-4 border-blue-100 flex items-center justify-center text-2xl font-semibold ${avatarBaseClass}`}
                  >
                    {profileInitials}
                  </div>
                )}
                <div>
                  <h2
                    className={`text-2xl md:text-3xl font-bold ${accentTextClass}`}
                  >
                    {member.full_name || t("memberLabel")}
                  </h2>
                  <p className={`${subtitleTextClass} mt-1`}>
                    {t("memberDashboardEmployeeId")}:{" "}
                    {member.employee_id || "-"}
                  </p>
                  <p className={subtitleTextClass}>
                    {t("memberDashboardStatus")}: {member.status || "-"}
                  </p>
                  <p className={`${softBadgeClass} mt-2`}>
                    {t("memberDashboardSavingType")}:{" "}
                    {toSavingLabel(member.saving_type)}
                  </p>
                </div>
              </div>

              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                  isDarkMode ? "text-slate-100" : "text-gray-800"
                }`}
              >
                <div className="space-y-2">
                  <h4 className={`font-semibold ${accentTextClass}`}>
                    {t("memberDashboardIdentity")}
                  </h4>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardId")}:
                    </span>{" "}
                    {member.id || "-"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardEmployeeId")}:
                    </span>{" "}
                    {member.employee_id || "-"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardFullName")}:
                    </span>{" "}
                    {member.full_name || "-"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardStatus")}:
                    </span>{" "}
                    {member.status || "-"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardRegistrationDate")}:
                    </span>{" "}
                    {formatDate(member.registration_date)}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className={`font-semibold ${accentTextClass}`}>
                    {t("memberDashboardContact")}
                  </h4>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardPhone")}:
                    </span>{" "}
                    {member.phone || "-"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardEmail")}:
                    </span>{" "}
                    {member.email || "-"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardCreatedAt")}:
                    </span>{" "}
                    {formatDate(member.created_at)}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardUpdatedAt")}:
                    </span>{" "}
                    {formatDate(member.updated_at)}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className={`font-semibold ${accentTextClass}`}>
                    {t("memberDashboardWork")}
                  </h4>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardDepartment")}:
                    </span>{" "}
                    {member.department || "-"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardOccupation")}:
                    </span>{" "}
                    {member.occupation || "-"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardJobPlace")}:
                    </span>{" "}
                    {member.job_place || "-"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardMonthlySalary")}:
                    </span>{" "}
                    {formatCurrency(member.monthly_salary)}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardApprovedBy")}:
                    </span>{" "}
                    {member.approved_by || "-"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className={`font-semibold ${accentTextClass}`}>
                    {t("memberDashboardAddress")}
                  </h4>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardTown")}:
                    </span>{" "}
                    {member.town || "-"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardZone")}:
                    </span>{" "}
                    {member.zone || "-"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardWoreda")}:
                    </span>{" "}
                    {member.woreda || "-"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardKebele")}:
                    </span>{" "}
                    {member.kebele || "-"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("memberDashboardHouseNo")}:
                    </span>{" "}
                    {member.house_no || "-"}
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <h4 className={`font-semibold ${accentTextClass}`}>
                    {t("memberDashboardSavingSetup")}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <p>
                      <span className="font-medium">
                        {t("memberDashboardSavingType")}:
                      </span>{" "}
                      {toSavingLabel(member.saving_type)}
                    </p>
                    <p>
                      <span className="font-medium">
                        {t("memberDashboardSavingPercentage")}:
                      </span>{" "}
                      {member.saving_percentage || 0}%
                    </p>
                    <p>
                      <span className="font-medium">
                        {t("memberDashboardShareAmount")}:
                      </span>{" "}
                      {member.share_amount || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div
              className={`max-w-xl mx-auto rounded-2xl shadow p-6 md:p-8 border ${
                isDarkMode
                  ? "bg-slate-700 border-slate-500"
                  : "bg-white border-gray-100"
              }`}
            >
              <div
                className={`flex items-center gap-4 pb-5 mb-5 border-b ${
                  isDarkMode ? "border-slate-500" : "border-gray-100"
                }`}
              >
                {member.profile_image ? (
                  <img
                    src={member.profile_image}
                    alt={member.full_name || t("memberLabel")}
                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={member.full_name || t("memberLabel")}
                    className={`w-16 h-16 rounded-full border-4 border-blue-100 flex items-center justify-center text-lg font-semibold ${avatarBaseClass}`}
                  >
                    {profileInitials}
                  </div>
                )}
                <div>
                  <p className={`text-lg font-semibold ${accentTextClass}`}>
                    {member.full_name || t("memberLabel")}
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-slate-200" : "text-gray-600"
                    }`}
                  >
                    {t("memberDashboardEmployeeId")}:{" "}
                    {member.employee_id || "-"}
                  </p>
                </div>
              </div>

              <h2 className={`text-2xl font-bold ${accentTextClass}`}>
                {t("memberDashboardMemberSettings")}
              </h2>
              <p className={`${subtitleTextClass} mt-2`}>
                {mustChangePassword
                  ? t("memberDashboardMustChangePassword")
                  : t("memberDashboardCanChangePassword")}
              </p>

              {!mustChangePassword && (
                <div
                  className={`mt-6 p-4 rounded-xl border ${
                    isDarkMode
                      ? "border-slate-500 bg-slate-600"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <h3 className={`text-lg font-semibold ${accentTextClass}`}>
                    {t("memberDashboardProfilePhoto")}
                  </h3>
                  <p className={`text-sm mt-1 ${subtitleTextClass}`}>
                    {t("memberDashboardUploadPhotoHelp")}
                  </p>

                  <form
                    onSubmit={handleProfileImageUpload}
                    className="mt-4 space-y-3"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileFileChange}
                      className={`block w-full text-sm file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#1e3a5f] file:text-white hover:file:opacity-90 ${
                        isDarkMode ? "text-slate-100" : "text-gray-700"
                      }`}
                    />

                    {imageError && (
                      <p className="text-sm text-red-600">{imageError}</p>
                    )}
                    {imageSuccess && (
                      <p className="text-sm text-green-700">{imageSuccess}</p>
                    )}

                    <button
                      type="submit"
                      disabled={imageUploading}
                      className="px-4 py-2 rounded-lg bg-[#1e3a5f] text-white font-semibold disabled:opacity-70"
                    >
                      {imageUploading
                        ? t("memberDashboardUploading")
                        : t("memberDashboardUpdateProfileImage")}
                    </button>
                  </form>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? "text-slate-100" : "text-gray-700"
                    }`}
                  >
                    {t("memberDashboardCurrentPassword")}
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleSettingsInputChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? "text-slate-100" : "text-gray-700"
                    }`}
                  >
                    {t("memberDashboardNewPassword")}
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleSettingsInputChange}
                    required
                    minLength={8}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? "text-slate-100" : "text-gray-700"
                    }`}
                  >
                    {t("memberDashboardConfirmNewPassword")}
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleSettingsInputChange}
                    required
                    minLength={8}
                    className={inputClass}
                  />
                </div>

                {formError && (
                  <p className="text-sm text-red-600">{formError}</p>
                )}
                {formSuccess && (
                  <p className="text-sm text-green-700">{formSuccess}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg bg-[#1e3a5f] text-white font-semibold disabled:opacity-70"
                >
                  {isSubmitting
                    ? t("memberDashboardUpdating")
                    : t("memberDashboardChangePassword")}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MemberDashboard;

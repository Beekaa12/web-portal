import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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

const MemberDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
          throw new Error(payload?.message || "Failed to load dashboard data");
        }

        setDashboardData(payload?.data || null);
      } catch (fetchError) {
        console.error("Error loading member dashboard:", fetchError);
        setError(fetchError.message || "Unable to load dashboard data");
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
          throw new Error(payload?.message || "Failed to load savings history");
        }

        setSavingsTransactions(
          Array.isArray(payload?.data) ? payload.data : [],
        );
      } catch (historyError) {
        console.error("Error loading savings history:", historyError);
        setSavingsTransactions([]);
        setTransactionsError(
          historyError.message || "Unable to load savings history",
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
      setImageError("Please choose an image first.");
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
        throw new Error(payload?.message || "Failed to update profile image");
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
      setImageSuccess("Profile image updated successfully.");
    } catch (uploadError) {
      setImageError(uploadError.message || "Could not update profile image.");
    } finally {
      setImageUploading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (formData.new_password.length < 8) {
      setFormError("New password must be at least 8 characters.");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setFormError("New password and confirm password do not match.");
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
        throw new Error(payload?.message || "Failed to change password");
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

      setFormSuccess("Password changed successfully.");
      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setTimeout(() => {
        handleTabChange("dashboard");
      }, 800);
    } catch (submitError) {
      setFormError(submitError.message || "Could not change password.");
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
    loanStatus: "No Active Loan",
  };
  const savingsHistory = savingsTransactions;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto rounded-full border-4 border-blue-200 border-t-[#1e3a5f] animate-spin" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700">
            Unable to load dashboard
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="mt-5 px-4 py-2 rounded-lg bg-[#1e3a5f] text-white"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <section className="relative bg-[#1e3a5f] text-white py-20">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Member Dashboard
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Profile overview, savings balances, loan summary, and saving history
            tracking.
          </p>
        </div>
      </section>

      <section className="py-12 mx-auto md:mx-8">
        <div className="container mx-auto px-4 space-y-8">
          {activeTab === "dashboard" && (
            <>
              <div className="bg-white rounded-2xl border border-blue-100 shadow-md p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <img
                    src={
                      member.profile_image ||
                      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={`${member.full_name || "Member"} profile`}
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
                  />

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {member.full_name || "Member"}
                    </h2>
                    <p className="text-gray-600">
                      Employee ID: {member.employee_id || "-"}
                    </p>
                    <p className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-[#1e3a5f] text-sm font-semibold border border-blue-200">
                      Saving Type: {toSavingLabel(member.saving_type)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <p className="text-sm text-gray-500 mb-2">
                    Compulsory Saving
                  </p>
                  <h3 className="text-2xl font-bold text-[#1e3a5f]">
                    {formatCurrency(summary.compulsoryBalance)}
                  </h3>
                </article>

                <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <p className="text-sm text-gray-500 mb-2">Voluntary Saving</p>
                  <h3 className="text-2xl font-bold text-[#1e3a5f]">
                    {formatCurrency(summary.voluntaryBalance)}
                  </h3>
                </article>

                <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <p className="text-sm text-gray-500 mb-2">
                    Total Saving Balance
                  </p>
                  <h3 className="text-2xl font-bold text-[#1e3a5f]">
                    {formatCurrency(summary.totalBalance)}
                  </h3>
                </article>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    Loan Summary
                  </h3>
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200 w-fit">
                    {summary.loanStatus}
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-gray-600">Amount of loan</p>
                    <p className="text-3xl font-bold text-[#1e3a5f] mt-1">
                      {formatCurrency(summary.loanAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rest loan (outstanding)</p>
                    <p className="text-3xl font-bold text-amber-700 mt-1">
                      {formatCurrency(summary.loanOutstanding)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-5">
                  Saving History Track
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left">
                    <thead>
                      <tr className="border-b border-gray-200 text-sm text-gray-500">
                        <th className="py-3 pr-4">Date</th>
                        <th className="py-3 px-4">Saving Type</th>
                        <th className="py-3 px-4">Deposit</th>
                        <th className="py-3 px-4">Withdrawal</th>
                        <th className="py-3 px-4">Interest</th>
                        <th className="py-3 px-4">Net</th>
                        <th className="py-3 pl-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionsLoading && (
                        <tr>
                          <td
                            className="py-6 text-center text-gray-500"
                            colSpan={7}
                          >
                            Loading savings history...
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
                            <tr
                              key={item.id}
                              className="border-b border-gray-100 text-gray-700"
                            >
                              <td className="py-3 pr-4 font-medium">
                                {formatDate(
                                  item.record_date || item.created_at,
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-[#1e3a5f] border-blue-200">
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
                                  {net >= 0 ? "Recorded" : "Adjusted"}
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
                              className="py-6 text-center text-gray-500"
                              colSpan={7}
                            >
                              No savings history found.
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6 pb-6 border-b border-gray-100 mb-6">
                <img
                  src={
                    member.profile_image ||
                    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80"
                  }
                  alt={member.full_name || "Member"}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f]">
                    {member.full_name || "Member"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Employee ID: {member.employee_id || "-"}
                  </p>
                  <p className="text-gray-600">
                    Status: {member.status || "-"}
                  </p>
                  <p className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-blue-50 text-[#1e3a5f] text-sm font-semibold border border-blue-200">
                    Saving Type: {toSavingLabel(member.saving_type)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-[#1e3a5f]">Identity</h4>
                  <p>
                    <span className="font-medium">ID:</span> {member.id || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Employee ID:</span>{" "}
                    {member.employee_id || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Full Name:</span>{" "}
                    {member.full_name || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {member.status || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Registration Date:</span>{" "}
                    {formatDate(member.registration_date)}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-[#1e3a5f]">Contact</h4>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {member.phone || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {member.email || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Created At:</span>{" "}
                    {formatDate(member.created_at)}
                  </p>
                  <p>
                    <span className="font-medium">Updated At:</span>{" "}
                    {formatDate(member.updated_at)}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-[#1e3a5f]">Work</h4>
                  <p>
                    <span className="font-medium">Department:</span>{" "}
                    {member.department || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Occupation:</span>{" "}
                    {member.occupation || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Job Place:</span>{" "}
                    {member.job_place || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Monthly Salary:</span>{" "}
                    {formatCurrency(member.monthly_salary)}
                  </p>
                  <p>
                    <span className="font-medium">Approved By:</span>{" "}
                    {member.approved_by || "-"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-[#1e3a5f]">Address</h4>
                  <p>
                    <span className="font-medium">Town:</span>{" "}
                    {member.town || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Zone:</span>{" "}
                    {member.zone || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Woreda:</span>{" "}
                    {member.woreda || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Kebele:</span>{" "}
                    {member.kebele || "-"}
                  </p>
                  <p>
                    <span className="font-medium">House No:</span>{" "}
                    {member.house_no || "-"}
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <h4 className="font-semibold text-[#1e3a5f]">Saving Setup</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <p>
                      <span className="font-medium">Saving Type:</span>{" "}
                      {toSavingLabel(member.saving_type)}
                    </p>
                    <p>
                      <span className="font-medium">Saving Percentage:</span>{" "}
                      {member.saving_percentage || 0}%
                    </p>
                    <p>
                      <span className="font-medium">Share Amount:</span>{" "}
                      {member.share_amount || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-2xl shadow p-6 md:p-8">
              <div className="flex items-center gap-4 pb-5 mb-5 border-b border-gray-100">
                <img
                  src={
                    member.profile_image ||
                    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80"
                  }
                  alt={member.full_name || "Member"}
                  className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                />
                <div>
                  <p className="text-lg font-semibold text-[#1e3a5f]">
                    {member.full_name || "Member"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Employee ID: {member.employee_id || "-"}
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#1e3a5f]">
                Member Settings
              </h2>
              <p className="text-gray-600 mt-2">
                {mustChangePassword
                  ? "You must change your password now before continuing."
                  : "You can change your password anytime."}
              </p>

              <div className="mt-6 p-4 rounded-xl border border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-[#1e3a5f]">
                  Profile Photo
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Upload a new profile image.
                </p>

                <form
                  onSubmit={handleProfileImageUpload}
                  className="mt-4 space-y-3"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileFileChange}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#1e3a5f] file:text-white hover:file:opacity-90"
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
                    {imageUploading ? "Uploading..." : "Update Profile Image"}
                  </button>
                </form>
              </div>

              <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleSettingsInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleSettingsInputChange}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleSettingsInputChange}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
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
                  {isSubmitting ? "Updating..." : "Change Password"}
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

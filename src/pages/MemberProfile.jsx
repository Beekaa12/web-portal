import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const MemberProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [member, setMember] = useState(null);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    loanAmount: 0,
    loanStatus: "No Active Loan",
  });

  useEffect(() => {
    const loadProfile = async () => {
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
          throw new Error(payload?.message || "Failed to load member profile");
        }

        setMember(payload?.data?.member || null);
        setSummary(payload?.data?.summary || summary);
      } catch (profileError) {
        console.error("Error fetching member profile:", profileError);
        setError(profileError.message || "Unable to load member profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto rounded-full border-4 border-blue-200 border-t-[#1e3a5f] animate-spin" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700">
            Unable to load profile
          </h2>
          <p className="mt-2 text-gray-600">
            {error || "Member data not found."}
          </p>
          <button
            onClick={() => navigate("/member-dashboard", { replace: true })}
            className="mt-5 px-4 py-2 rounded-lg bg-[#1e3a5f] text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-28 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6 pb-6 border-b border-gray-100">
          <img
            src={
              member.profile_image ||
              "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80"
            }
            alt={member.full_name || "Member"}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a5f]">
              {member.full_name || "Member"}
            </h1>
            <p className="text-gray-600 mt-1">
              Employee ID: {member.employee_id || "-"}
            </p>
            <p className="text-gray-600">Status: {member.status || "-"}</p>
            <p className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-blue-50 text-[#1e3a5f] text-sm font-semibold border border-blue-200">
              Saving Type: {toSavingLabel(member.saving_type)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <article className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Total Saving Balance</p>
            <p className="text-lg font-semibold text-[#1e3a5f] mt-1">
              {formatCurrency(summary.totalBalance)}
            </p>
          </article>
          <article className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Loan Amount</p>
            <p className="text-lg font-semibold text-[#1e3a5f] mt-1">
              {formatCurrency(summary.loanAmount)}
            </p>
          </article>
          <article className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Loan Status</p>
            <p className="text-lg font-semibold text-[#1e3a5f] mt-1">
              {summary.loanStatus || "No Active Loan"}
            </p>
          </article>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-[#1e3a5f]">Identity</h3>
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
            <h3 className="font-semibold text-[#1e3a5f]">Contact</h3>
            <p>
              <span className="font-medium">Phone:</span> {member.phone || "-"}
            </p>
            <p>
              <span className="font-medium">Email:</span> {member.email || "-"}
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
            <h3 className="font-semibold text-[#1e3a5f]">Work</h3>
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
            <h3 className="font-semibold text-[#1e3a5f]">Address</h3>
            <p>
              <span className="font-medium">Town:</span> {member.town || "-"}
            </p>
            <p>
              <span className="font-medium">Zone:</span> {member.zone || "-"}
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
            <h3 className="font-semibold text-[#1e3a5f]">Saving Setup</h3>
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
    </div>
  );
};

export default MemberProfile;

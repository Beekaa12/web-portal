import React, { useState } from "react";

const memberMock = {
  id: 48,
  employee_id: "EMP-0261",
  full_name: "Hana Tesfaye",
  phone: "+251 911 445 220",
  email: "hana.tesfaye@example.com",
  profileImage:
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80",
  status: "approved",
  created_at: "2025-12-19T08:12:00Z",
  updated_at: "2026-04-02T10:30:00Z",
  department: "Operations",
  registration_date: "2025-12-20",
  approved_by: 3,
  occupation: "Accountant",
  job_place: "Addis Cooperative PLC",
  monthly_salary: 26000,
  zone: "Bole",
  woreda: "Woreda 03",
  town: "Addis Ababa",
  kebele: "Kebele 12",
  house_no: "H-221",
  saving_percentage: 10,
  saving_type: "compulsory,voluntary",
  share_amount: 2,
  compulsoryBalance: 18500,
  voluntaryBalance: 7200,
  totalBalance: 25700,
  loanAmount: 120000,
  loanStatus: "Active",
  savingsHistory: [
    {
      id: 1,
      month: "January 2026",
      compulsory: 1500,
      voluntary: 500,
      total: 2000,
      status: "Completed",
    },
    {
      id: 2,
      month: "February 2026",
      compulsory: 1500,
      voluntary: 300,
      total: 1800,
      status: "Completed",
    },
    {
      id: 3,
      month: "March 2026",
      compulsory: 1500,
      voluntary: 700,
      total: 2200,
      status: "Completed",
    },
    {
      id: 4,
      month: "April 2026",
      compulsory: 1500,
      voluntary: 0,
      total: 1500,
      status: "Pending Review",
    },
  ],
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const toSavingLabel = (savingType) =>
  savingType
    .split(",")
    .map((item) => item.trim())
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" + ");

const MemberDashboard = () => {
  const [showDetails, setShowDetails] = useState(false);

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
          <div className="bg-white rounded-2xl border border-blue-100 shadow-md p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative group">
                <img
                  src={memberMock.profileImage}
                  alt={`${memberMock.full_name} profile`}
                  onClick={() => setShowDetails(true)}
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 cursor-pointer"
                />
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="inline-block whitespace-nowrap rounded-md bg-gray-900 text-white text-xs px-2.5 py-1.5 shadow-md">
                    Profile details
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="text-2xl font-bold text-gray-800 hover:text-[#1e3a5f] transition"
                >
                  {memberMock.full_name}
                </button>
                <p className="text-gray-600">
                  Employee ID: {memberMock.employee_id}
                </p>
                <p className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-[#1e3a5f] text-sm font-semibold border border-blue-200">
                  Saving Type: {toSavingLabel(memberMock.saving_type)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">Compulsory Saving</p>
              <h3 className="text-2xl font-bold text-[#1e3a5f]">
                {formatCurrency(memberMock.compulsoryBalance)}
              </h3>
            </article>

            <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">Voluntary Saving</p>
              <h3 className="text-2xl font-bold text-[#1e3a5f]">
                {formatCurrency(memberMock.voluntaryBalance)}
              </h3>
            </article>

            <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">Total Saving Balance</p>
              <h3 className="text-2xl font-bold text-[#1e3a5f]">
                {formatCurrency(memberMock.totalBalance)}
              </h3>
            </article>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3 className="text-xl font-bold text-gray-800">Loan Summary</h3>
              <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200 w-fit">
                {memberMock.loanStatus}
              </span>
            </div>
            <p className="mt-4 text-gray-600">Amount of loan (if available)</p>
            <p className="text-3xl font-bold text-[#1e3a5f] mt-1">
              {formatCurrency(memberMock.loanAmount)}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-5">
              Saving History Track
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-500">
                    <th className="py-3 pr-4">Month</th>
                    <th className="py-3 px-4">Compulsory</th>
                    <th className="py-3 px-4">Voluntary</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 pl-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {memberMock.savingsHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 text-gray-700"
                    >
                      <td className="py-3 pr-4 font-medium">{item.month}</td>
                      <td className="py-3 px-4">
                        {formatCurrency(item.compulsory)}
                      </td>
                      <td className="py-3 px-4">
                        {formatCurrency(item.voluntary)}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        {formatCurrency(item.total)}
                      </td>
                      <td className="py-3 pl-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            item.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDetails(false)}
          ></div>

          <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[88vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-800">
                Full Member Information
              </h3>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-[#1e3a5f]">Identity</h4>
                <p>
                  <span className="font-medium">ID:</span> {memberMock.id}
                </p>
                <p>
                  <span className="font-medium">Employee ID:</span>{" "}
                  {memberMock.employee_id}
                </p>
                <p>
                  <span className="font-medium">Full Name:</span>{" "}
                  {memberMock.full_name}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {memberMock.status}
                </p>
                <p>
                  <span className="font-medium">Registration Date:</span>{" "}
                  {formatDate(memberMock.registration_date)}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-[#1e3a5f]">Contact</h4>
                <p>
                  <span className="font-medium">Phone:</span> {memberMock.phone}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {memberMock.email}
                </p>
                <p>
                  <span className="font-medium">Created At:</span>{" "}
                  {formatDate(memberMock.created_at)}
                </p>
                <p>
                  <span className="font-medium">Updated At:</span>{" "}
                  {formatDate(memberMock.updated_at)}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-[#1e3a5f]">Work</h4>
                <p>
                  <span className="font-medium">Department:</span>{" "}
                  {memberMock.department}
                </p>
                <p>
                  <span className="font-medium">Occupation:</span>{" "}
                  {memberMock.occupation}
                </p>
                <p>
                  <span className="font-medium">Job Place:</span>{" "}
                  {memberMock.job_place}
                </p>
                <p>
                  <span className="font-medium">Monthly Salary:</span>{" "}
                  {formatCurrency(memberMock.monthly_salary)}
                </p>
                <p>
                  <span className="font-medium">Approved By:</span>{" "}
                  {memberMock.approved_by}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-[#1e3a5f]">Address</h4>
                <p>
                  <span className="font-medium">Town:</span> {memberMock.town}
                </p>
                <p>
                  <span className="font-medium">Zone:</span> {memberMock.zone}
                </p>
                <p>
                  <span className="font-medium">Woreda:</span>{" "}
                  {memberMock.woreda}
                </p>
                <p>
                  <span className="font-medium">Kebele:</span>{" "}
                  {memberMock.kebele}
                </p>
                <p>
                  <span className="font-medium">House No:</span>{" "}
                  {memberMock.house_no}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h4 className="font-semibold text-[#1e3a5f]">Saving Setup</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <p>
                    <span className="font-medium">Saving Type:</span>{" "}
                    {toSavingLabel(memberMock.saving_type)}
                  </p>
                  <p>
                    <span className="font-medium">Saving Percentage:</span>{" "}
                    {memberMock.saving_percentage}%
                  </p>
                  <p>
                    <span className="font-medium">Share Amount:</span>{" "}
                    {memberMock.share_amount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;

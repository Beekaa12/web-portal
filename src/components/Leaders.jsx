import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope, FaPhoneAlt, FaUserTie, FaBuilding } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Leaders = ({ isDarkMode = false }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sectionBgClass = isDarkMode
    ? "bg-gradient-to-b from-[#2f3d52] to-slate-700"
    : "bg-gradient-to-b from-blue-50 to-white";

  const contentBgClass = isDarkMode ? "bg-[#2f3d52]" : "bg-blue-50";

  const headingClass = isDarkMode
    ? "text-4xl font-bold text-slate-100 mb-3"
    : "text-4xl font-bold text-[#1e3a5f] mb-3";

  const subtitleClass = isDarkMode
    ? "text-slate-200 max-w-2xl mx-auto"
    : "text-gray-600 max-w-2xl mx-auto";

  const cardClass = isDarkMode
    ? "rounded-2xl border border-slate-500 bg-slate-700 shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
    : "rounded-2xl bg-white shadow-md hover:shadow-xl transition duration-300 overflow-hidden";

  const avatarSectionClass = isDarkMode
    ? "h-52 bg-gradient-to-r from-slate-600 to-slate-500 flex items-center justify-center"
    : "h-52 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center";

  const nameClass = isDarkMode
    ? "text-lg font-semibold text-slate-100 truncate"
    : "text-lg font-semibold text-gray-800 truncate";

  const roleClass = isDarkMode
    ? "flex items-center gap-1 text-sm font-medium text-blue-300 capitalize"
    : "flex items-center gap-1 text-sm font-medium text-blue-600 capitalize";

  const detailsClass = isDarkMode
    ? "space-y-2 text-sm text-slate-200"
    : "space-y-2 text-sm text-gray-600";

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);

        const roles = ["manager", "accountant", "committee"];

        const requests = roles.map((role) =>
          axios.get(`${import.meta.env.VITE_API_URL}/api/users/role/${role}`),
        );

        const responses = await Promise.all(requests);

        const leaders = responses.flatMap((res) =>
          res.data.success ? res.data.data : [],
        );

        setUsers(leaders);
      } catch (err) {
        console.error(err);
        setError("Failed to load leaders information.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <div className={sectionBgClass}>
        <p
          className={`text-center py-12 ${isDarkMode ? "text-slate-200" : "text-gray-600"}`}
        >
          {t("loadingLeaders")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={sectionBgClass}>
        <p className="text-center py-12 text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className={sectionBgClass}>
      <section className={`py-20 ${contentBgClass}`}>
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          {/* Section Header */}
          <div className="text-center mb-14">
            <h2 className={headingClass}>{t("leadersTitle")}</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-4"></div>
            <p className={subtitleClass}>{t("leadersSubtitle")}</p>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {users.map((user) => (
              <div key={user.id} className={cardClass}>
                {/* Avatar */}
                <div className={avatarSectionClass}>
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.full_name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {user.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={nameClass}>{user.full_name}</h3>

                    <span className={roleClass}>
                      <FaUserTie className="text-xs" />
                      {user.role}
                    </span>
                  </div>

                  <div className={detailsClass}>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-blue-500" />
                      <span className="truncate">{user.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaPhoneAlt className="text-blue-500" />
                      <span>{user.phone}</span>
                    </div>

                    {/* Office Number */}
                    <div className="flex items-center gap-2">
                      <FaBuilding className="text-blue-500" />
                      <span>Registrar building 2nd floor 208 room</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Leaders;

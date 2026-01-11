import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope, FaPhoneAlt, FaUserTie, FaBuilding } from "react-icons/fa";

const Leaders = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);

        const roles = ["manager", "accountant", "committee"];

        const requests = roles.map((role) =>
          axios.get(`${import.meta.env.VITE_API_URL}/api/users/role/${role}`)
        );

        const responses = await Promise.all(requests);

        const leaders = responses.flatMap((res) =>
          res.data.success ? res.data.data : []
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
      <p className="text-center py-12 text-gray-600">Loading leaders...</p>
    );
  }

  if (error) {
    return <p className="text-center py-12 text-red-500">{error}</p>;
  }

  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-[#1e3a5f] mb-3">
            Our Leadership Team
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the dedicated professionals guiding the Injibara University
            Employees Savings and Credit Cooperative Union.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              {/* Avatar */}
              <div className="h-52 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
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
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {user.full_name}
                  </h3>

                  <span className="flex items-center gap-1 text-sm font-medium text-blue-600 capitalize">
                    <FaUserTie className="text-xs" />
                    {user.role}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
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
  );
};

export default Leaders;

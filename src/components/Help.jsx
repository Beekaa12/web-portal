import { useEffect, useState } from "react";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
} from "react-icons/fi";

const Help = ({ isOpen, onClose }) => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/role/manager`,
        );

        if (!response.ok) throw new Error("Failed to fetch managers");

        const result = await response.json();

        const managersData = (result.data || []).map((manager) => ({
          id: manager.id,
          full_name: manager.full_name,
          email: manager.email,
          phone: manager.phone || "+251 911 000 000",
          department: manager.role || "Administration",
          office_address: "Injibara University, Main Campus",
          profile_image: manager.profile_image || null,
        }));

        setManagers(managersData);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Unable to load manager information");
        setManagers([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchManagers();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] p-6 text-white">
          <div>
            <h2 className="font-playfair text-2xl font-bold">
              Contact Support
            </h2>
            <p className="mt-1 text-blue-100">
              Reach out to the system administrators for help.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white transition-colors hover:bg-white hover:bg-opacity-20"
            aria-label="Close support modal"
            title="Close"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#1e3a5f]" />
              <p className="mt-4 text-gray-500">
                Loading manager information...
              </p>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-red-500">
                <FiX className="mx-auto text-4xl" />
              </div>
              <p className="font-medium text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-[#1e3a5f] px-4 py-2 text-white transition-colors hover:bg-[#2c5282]"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="mb-2 text-lg font-semibold text-blue-900">
                  How to Get Help
                </h3>
                <ol className="list-inside list-decimal space-y-2 text-blue-800">
                  <li>Visit any administrator listed below in person</li>
                  <li>Bring your staff ID or employee identification</li>
                  <li>Explain the issue you need help with</li>
                  <li>
                    The administrator will verify your identity and assist you
                  </li>
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="mb-4 font-playfair text-xl font-bold text-gray-900">
                  System Administrators
                </h3>
                {managers.length === 0 ? (
                  <div className="rounded-lg bg-gray-50 py-8 text-center">
                    <FiUser className="mx-auto mb-3 text-4xl text-gray-400" />
                    <p className="text-gray-500">No administrators found</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {managers.map((manager) => (
                      <div
                        key={manager.id}
                        className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-lg"
                      >
                        <div className="mb-3 flex items-center">
                          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#1e3a5f]">
                            {manager.profile_image ? (
                              <img
                                src={manager.profile_image}
                                alt={manager.full_name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-bold text-white">
                                {manager.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </span>
                            )}
                          </div>

                          <div className="ml-3">
                            <h4 className="text-lg font-bold text-gray-900">
                              {manager.full_name}
                            </h4>
                            <span className="inline-block rounded-full bg-[#1e3a5f] px-2 py-1 text-xs text-white">
                              System Administrator
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex items-center text-gray-600">
                            <FiMail className="mr-2 text-[#1e3a5f]" />
                            <span>{manager.email}</span>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <FiPhone className="mr-2 text-[#1e3a5f]" />
                            <span>{manager.phone}</span>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <FiBriefcase className="mr-2 text-[#1e3a5f]" />
                            <span>{manager.department}</span>
                          </div>

                          <div className="flex items-start text-gray-600">
                            <FiMapPin className="mt-0.5 mr-2 text-[#1e3a5f]" />
                            <span className="text-xs leading-relaxed">
                              {manager.office_address}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <h4 className="mb-2 font-semibold text-amber-900">
                  Important Notes
                </h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-amber-800">
                  <li>Support is handled in person for security reasons</li>
                  <li>Never share your password with anyone</li>
                  <li>
                    Administrators will never ask for your password by email
                  </li>
                  <li>Keep your login details secure and unique</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#1e3a5f] px-6 py-2 font-medium text-white transition-colors hover:bg-[#2c5282]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Help;

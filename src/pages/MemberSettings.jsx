import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const MemberSettings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [imageSuccess, setImageSuccess] = useState("");

  const token = localStorage.getItem("member_token");
  const memberProfile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("member_profile") || "null") || {};
    } catch {
      return {};
    }
  }, []);

  const mustChangePassword = Boolean(memberProfile?.must_change_password);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate, token]);

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileFileChange = (e) => {
    setImageError("");
    setImageSuccess("");
    setSelectedProfileFile(e.target.files?.[0] || null);
  };

  const handleProfileUpload = async (e) => {
    e.preventDefault();

    if (!selectedProfileFile) {
      setImageError("Please choose an image first.");
      return;
    }

    try {
      setImageUploading(true);
      setImageError("");
      setImageSuccess("");

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
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to update profile image");
      }

      const nextImageUrl = payload?.member?.profile_image || "";
      const latestProfile = {
        ...memberProfile,
        profile_image: nextImageUrl,
      };
      localStorage.setItem("member_profile", JSON.stringify(latestProfile));

      setSelectedProfileFile(null);
      setImageSuccess("Profile image updated successfully.");
    } catch (uploadError) {
      setImageError(uploadError.message || "Could not update profile image.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

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

      const updatedProfile = {
        ...memberProfile,
        must_change_password: false,
      };
      localStorage.setItem("member_profile", JSON.stringify(updatedProfile));

      setSuccess("Password changed successfully.");
      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      if (mustChangePassword) {
        setTimeout(() => {
          navigate("/member-dashboard", { replace: true });
        }, 800);
      }
    } catch (submitError) {
      setError(submitError.message || "Could not change password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-28 px-4">
      <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-2xl shadow p-6 md:p-8">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Member Settings</h1>
        <p className="text-gray-600 mt-2">
          {mustChangePassword
            ? "You must change your password now before continuing."
            : "You can change your password anytime."}
        </p>

        <div className="mt-6 p-4 rounded-xl border border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-[#1e3a5f]">
            Profile Photo
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Upload a new profile image.
          </p>

          <form onSubmit={handleProfileUpload} className="mt-4 space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#1e3a5f] file:text-white hover:file:opacity-90"
            />

            {imageError && <p className="text-sm text-red-600">{imageError}</p>}
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">{success}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 rounded-lg bg-[#1e3a5f] text-white font-semibold disabled:opacity-70"
          >
            {isSubmitting ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemberSettings;

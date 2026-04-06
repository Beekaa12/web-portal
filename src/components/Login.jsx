import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_USER = {
  email: "member@sacco.com",
  password: "12345678",
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    if (loginError) {
      setLoginError("");
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedEmail = formData.email.trim().toLowerCase();
    const normalizedPassword = formData.password.trim();

    if (
      normalizedEmail === MOCK_USER.email &&
      normalizedPassword === MOCK_USER.password
    ) {
      navigate("/member-dashboard");
      return;
    }

    setLoginError("Invalid email or password. Please use mock credentials.");
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Member Login</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Securely access your SACCO account and manage your services
          </p>
        </div>
      </div>

      {/* Login Card */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Please sign in to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-[#1e3a5f] text-white font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:ring-offset-2 transition"
              >
                Sign In
              </button>

              {loginError && (
                <p className="text-sm text-red-600 font-medium">{loginError}</p>
              )}
            </form>

            {/* Footer Note */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Having trouble logging in?{" "}
              <span className="text-[#1e3a5f] font-medium cursor-pointer hover:underline">
                Contact support
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;

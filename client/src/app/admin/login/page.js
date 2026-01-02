"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/lib/api.js";

// Theme Colors
const theme = {
  colorPrimary: "#1e3a8a", // Deep Blue
  colorAccent: "#f59e0b", // Warm Amber
  colorSuccess: "#16a34a", // Green
  colorBackground: "#f9fafb", // Light Gray
  colorGrayText: "#6b7280", // Gray Text
};

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Now using the api instance - it automatically uses correct BASE_URL
      const res = await api.post("/api/admin/login", form);

      localStorage.setItem("adminToken", res.data.token);

      // Success Toast
      toast.success("Login successful! Redirecting...", {
        style: { backgroundColor: theme.colorSuccess, color: "white" },
      });

      // Delay redirect slightly to show toast
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Invalid credentials. Please try again.";

      // Error Toast
      toast.error(errorMessage, {
        style: { backgroundColor: theme.colorPrimary, color: "white" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: theme.colorBackground }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl transition duration-300 hover:shadow-3xl">
        <h2
          className="text-4xl font-extrabold mb-8 text-center"
          style={{ color: theme.colorPrimary }}
        >
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{
              borderColor: theme.colorGrayText,
              "--tw-ring-color": theme.colorAccent,
            }}
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            value={form.email}
            required
            disabled={loading}
          />

          {/* Password Input */}
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{
              borderColor: theme.colorGrayText,
              "--tw-ring-color": theme.colorAccent,
            }}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            required
            disabled={loading}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: theme.colorPrimary,
              "--tw-ring-color": theme.colorPrimary,
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p
          className="mt-6 text-center text-sm"
          style={{ color: theme.colorGrayText }}
        >
          Don't have an account?{" "}
          <a
            href="/admin/signup"
            className="font-semibold"
            style={{ color: theme.colorPrimary }}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Theme Colors
const theme = {
  colorPrimary: "#1e3a8a", // Deep Blue
  colorAccent: "#f59e0b", // Warm Amber
  colorSuccess: "#16a34a", // Green
  colorBackground: "#f9fafb", // Light Gray
  colorGrayText: "#6b7280", // Gray Text
};

export default function AdminSignup() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/signup", form);
      // Success Toast
      toast.success("Admin account created successfully!", {
        style: { backgroundColor: theme.colorSuccess, color: "white" },
      });
      // Optionally clear the form
      setForm({ full_name: "", email: "", password: "" });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Signup failed. Please try again.";
      // Error Toast
      toast.error(errorMessage, {
        style: { backgroundColor: theme.colorPrimary, color: "white" },
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: theme.colorBackground }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl transition duration-300 hover:shadow-3xl">
        <h2
          className="text-4xl font-extrabold mb-6 text-center"
          style={{ color: theme.colorPrimary }}
        >
          Create Admin Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Input */}
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{
              borderColor: theme.colorGrayText,
              "--tw-ring-color": theme.colorAccent,
            }}
            type="text"
            name="full_name"
            placeholder="Full Name"
            onChange={handleChange}
            value={form.full_name}
            required
          />

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
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-opacity-50"
            style={{
              backgroundColor: theme.colorPrimary,
              "--tw-ring-color": theme.colorPrimary,
            }}
          >
            Create Admin
          </button>
        </form>

        <p
          className="mt-6 text-center text-sm"
          style={{ color: theme.colorGrayText }}
        >
          Already have an account?{" "}
          <a
            href="/admin/login"
            className="font-semibold"
            style={{ color: theme.colorPrimary }}
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}

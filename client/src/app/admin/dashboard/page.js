// app/admin/dashboard/page.js (or wherever your main layout component lives)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa"; // Icon for the mobile menu button
import AdminSidebar from "./components/Sidebar";

// Import the new standalone component

// Theme Colors (consistent with previous request)
const theme = {
  colorPrimary: "#1e3a8a", // Deep Blue
  colorBackground: "#f9fafb", // Light Gray
};

export default function AdminDashboard({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile menu

  // 1. Route Protection Logic
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen text-xl"
        style={{ backgroundColor: theme.colorBackground }}
      >
        <p>Authenticating Admin...</p>
      </div>
    );
  }

  // 2. Main Layout Render
  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: theme.colorBackground }}
    >
      {/* Sidebar Component */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        {/* Mobile Header/Toggle */}
        <header
          className="md:hidden sticky top-0 w-full p-4 shadow-md z-20"
          style={{ backgroundColor: "white" }}
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-xl rounded-md"
            style={{ color: theme.colorPrimary }}
          >
            <FaBars />
          </button>
          <span
            className="ml-4 text-lg font-bold"
            style={{ color: theme.colorPrimary }}
          >
            Admin Panel
          </span>
          {/* Add the Hi, Admin User / Logout links here if necessary */}
        </header>

        {/* Content Area */}
        <main className="p-4 md:p-8">
          <div className="bg-white p-6 rounded-xl shadow-lg min-h-[calc(100vh-120px)]">
            {children || (
              <>
                <h1
                  className="text-3xl font-semibold mb-6"
                  style={{ color: theme.colorPrimary }}
                >
                  Dashboard Overview
                </h1>
                <p className="text-lg text-gray-600">
                  Welcome to the AutoParts Admin Panel. Select a section from
                  the sidebar to manage your store.
                </p>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

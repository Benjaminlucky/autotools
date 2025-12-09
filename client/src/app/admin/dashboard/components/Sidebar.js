// components/AdminSidebar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingBag,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

// Theme Colors (consistent with previous requests)
const theme = {
  colorPrimary: "#1e3a8a", // Deep Blue
  colorAccent: "#f59e0b", // Warm Amber
};

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: FaTachometerAlt },
  { name: "Products", href: "/admin/products", icon: FaBox },
  { name: "Orders", href: "/admin/orders", icon: FaShoppingBag },
];

export default function AdminSidebar({ isOpen, onClose, onLogout }) {
  const pathname = usePathname();

  // Conditional class for responsiveness
  const sidebarClasses = isOpen
    ? "translate-x-0"
    : "-translate-x-full md:translate-x-0";

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Content */}
      <div
        className={`w-64 h-full fixed top-0 left-0 pt-4 z-40 transition-transform duration-300 ease-in-out shadow-2xl ${sidebarClasses}`}
        style={{ backgroundColor: "white", color: theme.colorPrimary }}
      >
        {/* Header and Close Button (Mobile Only) */}
        <div className="flex justify-between items-center px-6 py-4 md:hidden">
          <h2
            className="text-2xl font-bold"
            style={{ color: theme.colorPrimary }}
          >
            Admin Panel
          </h2>
          <button
            onClick={onClose}
            className="text-xl p-2 hover:bg-gray-100 rounded"
          >
            <FaTimes />
          </button>
        </div>

        {/* Panel Title (Desktop) */}
        <h2
          className="text-2xl font-bold px-6 py-4 hidden md:block"
          style={{ color: theme.colorPrimary }}
        >
          Admin Panel
        </h2>

        {/* Navigation Links */}
        <nav className="space-y-2 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose} // Close sidebar on mobile after navigation
                className={`flex items-center space-x-3 p-3 rounded-lg font-medium transition duration-150 ${
                  isActive ? "text-white shadow-md" : "hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor: isActive
                    ? theme.colorPrimary
                    : "transparent",
                  color: isActive ? "white" : "inherit",
                }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 p-3 text-red-600 border border-red-600 rounded-lg font-medium hover:bg-red-50 transition duration-150"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

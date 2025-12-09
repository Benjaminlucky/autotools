// components/Navbar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // ⬅️ Import usePathname
import { FaShoppingCart, FaHome } from "react-icons/fa"; // ⬅️ Import FaHome
import { useCart } from "@/context/CartContext";

// Theme Colors (Defined here for independent component styling)
const theme = {
  colorPrimary: "#1e3a8a", // Deep Blue (used for primary text/background)
  colorAccent: "#f59e0b", // Warm Amber (used for cart badge)
};

export default function Navbar() {
  const { cart } = useCart();
  const pathname = usePathname(); // Get the current path

  // Check if the current route is within the admin section
  const isAdminRoute = pathname.startsWith("/admin");

  // --- 1. Admin Navbar (Simplified View) ---
  if (isAdminRoute) {
    return (
      <header
        className="sticky top-0 z-50 w-full shadow-md p-4"
        style={{ backgroundColor: "white" }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          {/* Logo/Site Title */}
          <Link
            href="/"
            className="text-2xl font-bold"
            style={{ color: theme.colorPrimary }}
          >
            AutoParts
          </Link>

          {/* Go to Homepage Button */}
          <Link
            href="/"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition duration-150 text-white hover:opacity-90"
            style={{ backgroundColor: theme.colorPrimary }}
          >
            <FaHome />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </header>
    );
  }

  // --- 2. Standard Customer Navbar (Full View) ---
  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold"
          style={{ color: theme.colorPrimary }}
        >
          AutoParts
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-primary"
            style={{ "--tw-text-opacity": 1, color: theme.colorPrimary }}
          >
            Home
          </Link>

          {/* Cart Link */}
          <Link
            href="/cart"
            className="relative text-gray-700 flex items-center hover:text-primary"
            style={{ "--tw-text-opacity": 1, color: theme.colorPrimary }}
          >
            <FaShoppingCart className="mr-1 text-lg" />
            Cart
            {cart.length > 0 && (
              <span
                className="absolute -top-2 -right-3 text-white text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: theme.colorAccent }}
              >
                {cart.length}
              </span>
            )}
          </Link>

          {/* Auth Links */}
          <Link
            href="/login"
            className="text-gray-700 hover:text-primary"
            style={{ "--tw-text-opacity": 1, color: theme.colorPrimary }}
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition duration-150"
            style={{ backgroundColor: theme.colorPrimary }}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

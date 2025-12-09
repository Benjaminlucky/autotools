// app/layout.js

import "./globals.css";
// import { Geist, Geist_Mono } from "next/font/google"; // Removed/Commented out incomplete font imports
import Navbar from "@/components/Navbar";

// ⬅️ Import ToastContainer and the CSS for react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "Auto Parts Marketplace",
  description: "All your auto parts in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {" "}
          <Navbar />
          {children}
          {/* ⬅️ Add the ToastContainer here, positioned top-right for a modern look */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </CartProvider>
      </body>
    </html>
  );
}

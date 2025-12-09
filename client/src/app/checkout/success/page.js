"use client";

import CheckoutSteps from "@/components/checkoutSteps";
import Link from "next/link";

export default function Success() {
  return (
    <div className="container mx-auto px-6 py-20 max-w-xl text-center">
      <CheckoutSteps step={3} />

      <h1 className="text-4xl font-bold text-green-600 mb-4">
        Order Successful!
      </h1>
      <p className="text-gray-600 mb-8">Thanks for shopping with us.</p>

      <Link
        href="/"
        className="bg-primary text-white py-3 px-6 rounded-lg text-lg"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

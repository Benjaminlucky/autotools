"use client";
import { useState, useEffect } from "react";
import CheckoutSteps from "@/components/checkoutSteps";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function InformationPage() {
  const router = useRouter();
  const { cart } = useCart();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  useEffect(() => {
    // Check if cart is empty
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    // Load saved data if exists
    const saved = localStorage.getItem("checkout-info");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, [cart, router]);

  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    localStorage.setItem("checkout-info", JSON.stringify(data));
    toast.success("Contact information saved");
    router.push("/checkout/shipping");
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-xl">
      <CheckoutSteps step={0} />
      <h1 className="text-3xl font-bold mb-6">Contact Information</h1>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            name="email"
            type="email"
            required
            defaultValue={formData.email}
            placeholder="your.email@example.com"
            className="p-3 border w-full rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            name="phone"
            type="tel"
            required
            defaultValue={formData.phone}
            placeholder="08012345678"
            className="p-3 border w-full rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <button className="bg-primary text-white w-full py-3 rounded-lg text-lg hover:bg-blue-700 transition mt-6">
          Continue →
        </button>
      </form>
    </div>
  );
}

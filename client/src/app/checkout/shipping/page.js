"use client";
import { useState, useEffect } from "react";
import CheckoutSteps from "@/components/checkoutSteps";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function ShippingPage() {
  const router = useRouter();
  const { cart } = useCart();
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    notes: "",
  });

  useEffect(() => {
    // Check if cart is empty
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    // Check if contact info exists
    const contactInfo = localStorage.getItem("checkout-info");
    if (!contactInfo) {
      toast.error("Please provide contact information first");
      router.push("/checkout/information");
      return;
    }

    // Load saved shipping data if exists
    const saved = localStorage.getItem("checkout-shipping");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, [cart, router]);

  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    localStorage.setItem("checkout-shipping", JSON.stringify(data));
    toast.success("Shipping information saved");
    router.push("/checkout/payment");
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-xl">
      <CheckoutSteps step={1} />
      <h1 className="text-3xl font-bold mb-6">Shipping Address</h1>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            name="full_name"
            type="text"
            required
            defaultValue={formData.full_name}
            placeholder="John Doe"
            className="p-3 border w-full rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            name="address"
            type="text"
            required
            defaultValue={formData.address}
            placeholder="123 Main Street, Apartment 4B"
            className="p-3 border w-full rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              name="city"
              type="text"
              required
              defaultValue={formData.city}
              placeholder="Lagos"
              className="p-3 border w-full rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              name="state"
              type="text"
              required
              defaultValue={formData.state}
              placeholder="Lagos"
              className="p-3 border w-full rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code (Optional)
          </label>
          <input
            name="postal_code"
            type="text"
            defaultValue={formData.postal_code}
            placeholder="100001"
            className="p-3 border w-full rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Notes (Optional)
          </label>
          <textarea
            name="notes"
            defaultValue={formData.notes}
            rows="3"
            placeholder="Any special delivery instructions? (e.g., gate code, landmarks)"
            className="p-3 border w-full rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/checkout/information")}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            ← Back
          </button>

          <button
            type="submit"
            className="flex-1 bg-primary text-white py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Continue →
          </button>
        </div>
      </form>
    </div>
  );
}

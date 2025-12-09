"use client";
import CheckoutSteps from "@/components/checkoutSteps";
import { useCart } from "@/context/CartContext.js";
// FIX: Change import name from useCartStore to useCart

import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  // FIX: Change usage name from useCartStore() to useCart()
  const { cart, clearCart } = useCart();
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const payNow = () => {
    clearCart();
    router.push("/checkout/success");
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-xl">
      <CheckoutSteps step={2} />
      <h1 className="text-3xl font-bold mb-6">Order Summary</h1>

      <div className="bg-white shadow rounded-lg p-5 space-y-3">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between border-b pb-2">
            <p>
              {item.name} × {item.quantity}
            </p>
            <p>₦{(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}
        <p className="font-bold text-xl">Total: ₦{total.toLocaleString()}</p>
      </div>

      <button
        onClick={payNow}
        className="bg-primary text-white w-full py-3 rounded-lg text-lg mt-6"
      >
        Pay Now →
      </button>
    </div>
  );
}

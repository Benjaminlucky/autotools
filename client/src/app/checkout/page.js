"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import ProgressSteps from "@/components/ProgressSteps"; // Assuming this is styled nicely

// OPTIONAL → send to backend (Functionality unchanged)
async function saveOrderToDB(order) {
  await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
}

export default function CheckoutPage() {
  const { cart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const SHIPPING = 2000; // FLAT RATE
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0) + SHIPPING;

  const [form, setForm] = useState({
    email: "",
    phone: "",
    address: "",
    paymentMethod: "",
  });

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  // ================= FINAL SUBMIT (Functionality unchanged) ==================
  async function finishOrder() {
    const orderData = {
      ...form,
      cart,
      shippingFee: SHIPPING,
      totalAmount: total,
      paymentStatus: form.paymentMethod === "paystack" ? "Paid" : "Pending",
      createdAt: new Date(),
    };

    setLoading(true);
    await saveOrderToDB(orderData);

    if (form.paymentMethod === "paystack") {
      // redirect to payment
      alert("Redirect to Paystack...");
    } else {
      alert("Order Placed — Pay on Delivery 🚚");
    }
    setLoading(false);
  }

  // Helper for input styling
  const inputClass =
    "w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition duration-150";
  // Helper for primary button styling
  const primaryBtnClass =
    "w-full py-3 bg-primary text-white rounded-xl text-lg hover:bg-primary-dark transition duration-150 disabled:bg-gray-400";
  // Helper for back button styling
  const backBtnClass =
    "text-gray-600 hover:text-gray-800 transition duration-150 py-3";
  // Helper for step container
  const stepContainerClass = "bg-white p-8 rounded-xl shadow-lg";

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Progress Steps Section */}
      <div className="max-w-4xl mx-auto mb-10">
        <ProgressSteps step={step} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {/* Checkout Steps Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1 — CONTACT INFO */}
          {step === 1 && (
            <div className={stepContainerClass}>
              <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
                1. Contact Information 📞
              </h2>

              <div className="space-y-4 max-w-xl">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />

                <input
                  type="tel" // Changed to tel for semantic correctness
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                />

                <button
                  onClick={next}
                  // Basic validation: must have email and phone
                  disabled={!form.email || !form.phone}
                  className={primaryBtnClass + " mt-4"}
                >
                  Continue to Delivery →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — DELIVERY */}
          {step === 2 && (
            <div className={stepContainerClass}>
              <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
                2. Delivery Address 📍
              </h2>

              <div className="space-y-4 max-w-xl">
                <textarea
                  placeholder="Street, House No, Landmark... (Include City/State)"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className={inputClass + " h-32 resize-none"}
                />

                <div className="flex justify-between items-center pt-4">
                  <button onClick={prev} className={backBtnClass}>
                    ← Back to Contact
                  </button>
                  <button
                    onClick={next}
                    disabled={!form.address.trim()}
                    className="bg-primary text-white px-8 py-3 rounded-xl text-lg hover:bg-primary-dark transition duration-150 disabled:bg-gray-400"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — PAYMENT */}
          {step === 3 && (
            <div className={stepContainerClass}>
              <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
                3. Payment Method 💳
              </h2>

              <div className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    className={`border rounded-xl py-4 transition duration-150 ${
                      form.paymentMethod === "paystack"
                        ? "border-primary bg-blue-50 ring-2 ring-primary"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setForm({ ...form, paymentMethod: "paystack" })
                    }
                  >
                    <span className="font-semibold">Pay Online</span> (Paystack)
                  </button>

                  <button
                    className={`border rounded-xl py-4 transition duration-150 ${
                      form.paymentMethod === "cod"
                        ? "border-primary bg-blue-50 ring-2 ring-primary"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setForm({ ...form, paymentMethod: "cod" })}
                  >
                    <span className="font-semibold">Cash on Delivery</span> 🚚
                  </button>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button onClick={prev} className={backBtnClass}>
                    ← Back to Delivery
                  </button>
                  <button
                    onClick={next}
                    disabled={!form.paymentMethod}
                    className="bg-primary text-white px-8 py-3 rounded-xl text-lg hover:bg-primary-dark transition duration-150 disabled:bg-gray-400"
                  >
                    Continue to Review →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — REVIEW */}
          {step === 4 && (
            <div className={stepContainerClass}>
              <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
                4. Review & Confirm 🎉
              </h2>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 space-y-3 max-w-xl">
                <h3 className="text-xl font-semibold mb-2">Your Details</h3>
                <p>
                  <strong className="text-gray-700">Email:</strong> {form.email}
                </p>
                <p>
                  <strong className="text-gray-700">Phone:</strong> {form.phone}
                </p>
                <p>
                  <strong className="text-gray-700">Address:</strong>{" "}
                  {form.address}
                </p>
                <p>
                  <strong className="text-gray-700">Payment:</strong>{" "}
                  {form.paymentMethod === "cod"
                    ? "Pay on Delivery 🚚"
                    : "Pay Online (Paystack) 💳"}
                </p>
              </div>

              <div className="flex justify-between items-center pt-6">
                <button onClick={prev} className={backBtnClass}>
                  ← Back to Payment
                </button>

                <button
                  onClick={finishOrder}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-green-700 transition duration-150"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Place Final Order"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ORDER SUMMARY (Sticky/Fixed Column) (1/3 width on large screens) */}
        <div className="lg:col-span-1">
          <div className="sticky top-10 w-full p-6 border shadow-xl rounded-xl bg-white">
            <h3 className="font-extrabold text-2xl mb-4 border-b pb-2 text-gray-800">
              Your Order
            </h3>

            <div className="space-y-2 mb-4">
              {cart.map((i) => (
                <div
                  key={i.id}
                  className="flex justify-between text-gray-600 text-sm"
                >
                  <span className="truncate pr-2">
                    {i.name} × **{i.quantity}**
                  </span>
                  <span>₦{(i.price * i.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <hr className="my-4 border-gray-200" />
            <div className="space-y-2">
              <p className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>
                  ₦
                  {cart
                    .reduce((s, i) => s + i.price * i.quantity, 0)
                    .toLocaleString()}
                </span>
              </p>
              <p className="flex justify-between text-gray-700">
                <span>Shipping Fee:</span>
                <b>₦{SHIPPING.toLocaleString()}</b>
              </p>
            </div>

            <hr className="my-4 border-2 border-primary" />
            <h2 className="text-2xl font-extrabold flex justify-between text-primary">
              <span>Grand Total:</span>
              <span>₦{total.toLocaleString()}</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

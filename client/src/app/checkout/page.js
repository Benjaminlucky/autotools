"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import ProgressSteps from "@/components/ProgressSteps";
import api from "@/lib/api.js";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const SHIPPING = 2000; // FLAT RATE
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + SHIPPING;

  const [form, setForm] = useState({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    paymentMethod: "",
    deliveryNotes: "",
  });

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  // Create order and redirect to success (used by COD and Paystack success callback)
  const createOrderAndRedirect = useCallback(
    async (paymentMethod, paymentStatus = "pending", transactionId = null) => {
      const items = cart.map((item) => ({
        product_id: item._id || item.id,
        product_name: item.name || item.product_name,
        price: item.price,
        quantity: item.quantity,
      }));

      const orderData = {
        customer: { email: form.email, phone: form.phone },
        shipping: {
          full_name: form.fullName,
          address: form.address,
          city: form.city,
          state: form.state,
          postal_code: form.postalCode || "",
          country: "Nigeria",
        },
        items,
        payment: {
          method: paymentMethod,
          status: paymentStatus,
          transaction_id: transactionId,
        },
        shipping_fee: SHIPPING,
        tax: 0,
        delivery_notes: form.deliveryNotes || "",
      };

      const response = await api.post("/api/orders", orderData);
      if (response.data.success) {
        const order = response.data.data;
        const methodLabel =
          paymentMethod === "paystack" ? "paystack" : "cash_on_delivery";
        toast.success(`Order #${order.order_number} placed successfully!`);
        localStorage.setItem(
          "last-order",
          JSON.stringify({
            order_number: order.order_number,
            order_id: order._id,
            total,
            payment_method: methodLabel,
            payment_status: paymentStatus,
          })
        );
        clearCart();
        router.push("/checkout/success");
      }
      return response;
    },
    [cart, form, total]
  );

  // Open Paystack payment modal (client-only, dynamic import)
  const openPaystackModal = useCallback(async () => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim();
    if (!publicKey) {
      toast.error("Payment config missing. Add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.");
      setLoading(false);
      return;
    }
    if (publicKey.startsWith("sk_")) {
      toast.error(
        "Use your Paystack PUBLIC key (pk_...) not the secret key. Get it from Paystack Dashboard → Settings → API Keys"
      );
      setLoading(false);
      return;
    }

    try {
      const { default: PaystackPop } = await import("@paystack/inline-js");
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: publicKey,
        email: form.email,
        amount: Math.round(total * 100),
        ref: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        metadata: {
          custom_fields: [
            { display_name: "Customer Name", variable_name: "customer_name", value: form.fullName },
            { display_name: "Phone", variable_name: "phone", value: form.phone },
          ],
        },
        onSuccess: (transaction) => {
          toast.success("Payment successful!");
          createOrderAndRedirect("paystack", "paid", transaction.reference);
        },
        onCancel: () => {
          setLoading(false);
          toast.error("Payment cancelled");
        },
        onError: (err) => {
          setLoading(false);
          toast.error(err?.message || "Payment failed. Please try again.");
        },
      });
    } catch (err) {
      console.error("Paystack error:", err);
      setLoading(false);
      toast.error("Failed to load payment. Please try again.");
    }
  }, [form, total, createOrderAndRedirect]);

  // ================= FINAL SUBMIT ==================
  async function finishOrder() {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    setLoading(true);

    if (form.paymentMethod === "paystack") {
      // Pay Online: Open Paystack modal first, create order only on success
      openPaystackModal();
      return;
    }

    // Cash on Delivery: Create order immediately
    try {
      await createOrderAndRedirect("cash_on_delivery", "pending");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to place order. Please try again.";
      toast.error(errorMessage);
      if (errorMessage.toLowerCase().includes("stock")) {
        setTimeout(() => router.push("/cart"), 2000);
      }
    } finally {
      setLoading(false);
    }
  }

  // Helper for input styling
  const inputClass =
    "w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition duration-150";
  // Helper for primary button styling
  const primaryBtnClass =
    "w-full py-3 bg-primary text-white rounded-xl text-lg hover:bg-primary-dark transition duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed";
  // Helper for back button styling
  const backBtnClass =
    "text-gray-600 hover:text-gray-800 transition duration-150 py-3";
  // Helper for step container
  const stepContainerClass = "bg-white p-8 rounded-xl shadow-lg";

  // Cart empty check
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center bg-white p-12 rounded-xl shadow-lg">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Add some products before checking out
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="08012345678"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className={inputClass}
                    required
                  />
                </div>

                <button
                  onClick={next}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <textarea
                    placeholder="123 Main Street, Apartment 4B"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className={inputClass + " h-24 resize-none"}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="Lagos"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      placeholder="Lagos"
                      value={form.state}
                      onChange={(e) =>
                        setForm({ ...form, state: e.target.value })
                      }
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="100001"
                    value={form.postalCode}
                    onChange={(e) =>
                      setForm({ ...form, postalCode: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Any special delivery instructions? (e.g., gate code, landmarks)"
                    value={form.deliveryNotes}
                    onChange={(e) =>
                      setForm({ ...form, deliveryNotes: e.target.value })
                    }
                    className={inputClass + " h-20 resize-none"}
                  />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button onClick={prev} className={backBtnClass}>
                    ← Back to Contact
                  </button>
                  <button
                    onClick={next}
                    disabled={
                      !form.fullName ||
                      !form.address.trim() ||
                      !form.city ||
                      !form.state
                    }
                    className="bg-primary text-white px-8 py-3 rounded-xl text-lg hover:bg-primary-dark transition duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                    className={`border rounded-xl py-4 px-4 transition duration-150 ${
                      form.paymentMethod === "paystack"
                        ? "border-primary bg-blue-50 ring-2 ring-primary"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setForm({ ...form, paymentMethod: "paystack" })
                    }
                  >
                    <div className="text-center">
                      <span className="font-semibold block">Pay Online</span>
                      <span className="text-sm text-gray-600">
                        Card / Bank Transfer
                      </span>
                    </div>
                  </button>

                  <button
                    className={`border rounded-xl py-4 px-4 transition duration-150 ${
                      form.paymentMethod === "cod"
                        ? "border-primary bg-blue-50 ring-2 ring-primary"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setForm({ ...form, paymentMethod: "cod" })}
                  >
                    <div className="text-center">
                      <span className="font-semibold block">
                        Cash on Delivery
                      </span>
                      <span className="text-sm text-gray-600">
                        Pay when you receive 🚚
                      </span>
                    </div>
                  </button>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button onClick={prev} className={backBtnClass}>
                    ← Back to Delivery
                  </button>
                  <button
                    onClick={next}
                    disabled={!form.paymentMethod}
                    className="bg-primary text-white px-8 py-3 rounded-xl text-lg hover:bg-primary-dark transition duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
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

              <div className="space-y-4">
                {/* Contact Info */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Email:</strong> {form.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {form.phone}
                    </p>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Delivery Address
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Name:</strong> {form.fullName}
                    </p>
                    <p>
                      <strong>Address:</strong> {form.address}
                    </p>
                    <p>
                      <strong>City:</strong> {form.city}, {form.state}{" "}
                      {form.postalCode}
                    </p>
                    {form.deliveryNotes && (
                      <p>
                        <strong>Notes:</strong> {form.deliveryNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Payment Method
                  </h3>
                  <p className="text-sm">
                    {form.paymentMethod === "cod"
                      ? "💰 Pay on Delivery (Cash)"
                      : "💳 Pay Online (Card / Bank Transfer)"}
                  </p>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Order Items
                  </h3>
                  <div className="space-y-2">
                    {cart.map((item) => {
                      const itemName = item.name || item.product_name;
                      return (
                        <div
                          key={item._id || item.id}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {itemName} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6">
                <button onClick={prev} className={backBtnClass}>
                  ← Back to Payment
                </button>

                <button
                  onClick={finishOrder}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-green-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Place Final Order"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ORDER SUMMARY (Sticky/Fixed Column) */}
        <div className="lg:col-span-1">
          <div className="sticky top-10 w-full p-6 border shadow-xl rounded-xl bg-white">
            <h3 className="font-extrabold text-2xl mb-4 border-b pb-2 text-gray-800">
              Your Order
            </h3>

            <div className="space-y-2 mb-4">
              {cart.map((i) => {
                const itemName = i.name || i.product_name;
                return (
                  <div
                    key={i._id || i.id}
                    className="flex justify-between text-gray-600 text-sm"
                  >
                    <span className="truncate pr-2">
                      {itemName} × <strong>{i.quantity}</strong>
                    </span>
                    <span>₦{(i.price * i.quantity).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>

            <hr className="my-4 border-gray-200" />
            <div className="space-y-2">
              <p className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>₦{subtotal.toLocaleString()}</span>
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

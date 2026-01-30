"use client";
import { useState, useEffect, useCallback } from "react";
import CheckoutSteps from "@/components/checkoutSteps";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [customerInfo, setCustomerInfo] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);

  const SHIPPING = 2000;
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + SHIPPING;

  useEffect(() => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    const contactInfo = localStorage.getItem("checkout-info");
    const shippingData = localStorage.getItem("checkout-shipping");

    if (!contactInfo) {
      toast.error("Please provide contact information");
      router.push("/checkout/information");
      return;
    }

    if (!shippingData) {
      toast.error("Please provide shipping information");
      router.push("/checkout/shipping");
      return;
    }

    setCustomerInfo(JSON.parse(contactInfo));
    setShippingInfo(JSON.parse(shippingData));
  }, [cart, router]);

  // Create Order Function
  const createOrder = async (
    method,
    paymentStatus = "pending",
    transactionId = null,
  ) => {
    try {
      console.log("Creating order with:", { method, paymentStatus, transactionId });
      setLoading(true);
      const items = cart.map((item) => ({
        product_id: item._id || item.id,
        product_name: item.name || item.product_name,
        price: item.price,
        quantity: item.quantity,
      }));

      const orderData = {
        customer: {
          email: customerInfo.email,
          phone: customerInfo.phone,
        },
        shipping: {
          full_name: shippingInfo.full_name,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postal_code: shippingInfo.postal_code || "",
          country: "Nigeria",
        },
        items,
        payment: {
          method: method,
          status: paymentStatus,
          transaction_id: transactionId,
        },
        shipping_fee: SHIPPING,
        tax: 0,
        delivery_notes: shippingInfo.notes || "",
      };

      console.log("Sending order data:", orderData);
      const response = await api.post("/api/orders", orderData);
      console.log("Order creation response:", response.data);

      if (response.data.success) {
        const order = response.data.data;
        toast.success(`Order #${order.order_number} placed successfully!`);

        localStorage.setItem(
          "last-order",
          JSON.stringify({
            order_number: order.order_number,
            order_id: order._id,
            total: total,
            payment_method: method,
            payment_status: paymentStatus,
          }),
        );

        clearCart();
        localStorage.removeItem("checkout-info");
        localStorage.removeItem("checkout-shipping");
        router.push("/checkout/success");
      }
    } catch (error) {
      console.error("Order creation error details:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || "Failed to place order.";
      toast.error(errorMessage);
      if (errorMessage.toLowerCase().includes("stock")) {
        setTimeout(() => router.push("/cart"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initialize Paystack Payment - dynamic import to avoid Next.js SSR issues
  const initializePaystackPayment = useCallback(async () => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim();
    if (!publicKey) {
      toast.error("Paystack public key is missing. Add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to .env.local");
      setLoading(false);
      return;
    }
    if (publicKey.startsWith("sk_")) {
      toast.error("Use your Paystack PUBLIC key (pk_) not the secret key. Get it from Paystack Dashboard → Settings → API Keys");
      setLoading(false);
      return;
    }

    try {
      const { default: PaystackPop } = await import("@paystack/inline-js");
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: publicKey,
        email: customerInfo.email,
        amount: Math.round(total * 100),
        ref: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        metadata: {
          custom_fields: [
            { display_name: "Customer Name", variable_name: "customer_name", value: shippingInfo.full_name },
            { display_name: "Phone", variable_name: "phone", value: customerInfo.phone },
            { display_name: "Cart Items", variable_name: "cart_items", value: String(cart.length) },
          ],
        },
        onSuccess: (transaction) => {
          toast.success("Payment successful!");
          createOrder("paystack", "paid", transaction.reference);
        },
        onCancel: () => {
          setLoading(false);
          toast.error("Payment cancelled");
        },
        onError: (error) => {
          setLoading(false);
          toast.error(error?.message || "Payment failed. Please try again.");
        },
      });
    } catch (error) {
      console.error("Paystack error:", error);
      toast.error("Failed to initialize payment. Please try again.");
      setLoading(false);
    }
  }, [customerInfo, shippingInfo, cart.length, total]);

  const placeOrder = async () => {
    if (!customerInfo || !shippingInfo) {
      toast.error("Missing checkout information");
      return;
    }

    if (paymentMethod === "paystack") {
      if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim()) {
        toast.error("Payment configuration error. Please contact support.");
        return;
      }
      setLoading(true);
      await initializePaystackPayment();
    } else if (paymentMethod === "cash_on_delivery") {
      createOrder("cash_on_delivery", "pending");
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-4xl">
      <CheckoutSteps step={2} />
      <h1 className="text-3xl font-bold mb-6">Payment Method</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Select Payment Method
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  paymentMethod === "cash_on_delivery"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash_on_delivery"
                  checked={paymentMethod === "cash_on_delivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-green-600"
                  disabled={loading}
                />
                <div className="ml-3">
                  <p className="font-semibold">Cash on Delivery 🚚</p>
                  <p className="text-sm text-gray-600">
                    Pay when you receive your order
                  </p>
                </div>
              </label>

              {/* Pay online with Paystack */}
              <label
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  paymentMethod === "paystack"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="paystack"
                  checked={paymentMethod === "paystack"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-blue-600"
                  disabled={loading}
                />
                <div className="ml-3">
                  <p className="font-semibold">Pay Online 💳</p>
                  <p className="text-sm text-gray-600">
                    Secure payment via Paystack (card, USSD, bank, etc.)
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/checkout/shipping")}
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Back
            </button>

            <button
              onClick={placeOrder}
              disabled={loading}
              className={`flex-1 text-white py-3 rounded-lg text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                paymentMethod === "paystack"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading
                ? "Processing..."
                : paymentMethod === "paystack"
                  ? "Pay Now →"
                  : "Place Order →"}
            </button>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="hidden lg:block">
          <div className="bg-white shadow rounded-lg p-5 sticky top-6">
            <h3 className="font-bold text-xl mb-3 border-b pb-2">
              Order Summary
            </h3>
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600 truncate pr-2">
                    {item.name || item.product_name} × {item.quantity}
                  </span>
                  <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal:</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping:</span>
                <span>₦{SHIPPING.toLocaleString()}</span>
              </div>
              <div className="font-bold text-xl flex justify-between border-t pt-2 mt-2">
                <span>Total:</span>
                <span className="text-green-600">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

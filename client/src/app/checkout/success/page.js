"use client";
import { useEffect, useState } from "react";
import CheckoutSteps from "@/components/checkoutSteps";
import Link from "next/link";
import {
  FaCheckCircle,
  FaWhatsapp,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function Success() {
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    const lastOrder = localStorage.getItem("last-order");
    if (lastOrder) {
      setOrderInfo(JSON.parse(lastOrder));
    }
  }, []);

  const whatsappNumber = "2348012345678"; // Replace with your actual WhatsApp number
  const whatsappMessage = orderInfo
    ? `Hello! I just placed order #${orderInfo.order_number}. I would like to confirm my order.`
    : "Hello! I just placed an order on your website.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  // Get payment icon
  const getPaymentIcon = () => {
    if (!orderInfo?.payment_method)
      return <FaMoneyBillWave className="text-xl" />;

    switch (orderInfo.payment_method) {
      case "paystack":
      case "card":
        return <FaCreditCard className="text-xl" />;
      case "cash_on_delivery":
      default:
        return <FaMoneyBillWave className="text-xl" />;
    }
  };

  // Get payment method text
  const getPaymentMethodText = () => {
    if (!orderInfo?.payment_method) return "Cash on Delivery";

    switch (orderInfo.payment_method) {
      case "paystack":
      case "card":
        return orderInfo.payment_status === "paid"
          ? "Paystack (Paid)"
          : "Paystack (Pending)";
      case "cash_on_delivery":
      default:
        return "Cash on Delivery";
    }
  };

  // Get payment status color
  const getPaymentStatusColor = () => {
    if (orderInfo?.payment_status === "paid") {
      return "bg-green-100 text-green-800 border-green-300";
    }
    return "bg-yellow-100 text-yellow-800 border-yellow-300";
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <CheckoutSteps step={3} />

      <div className="bg-white rounded-xl shadow-lg p-8 text-center mt-6">
        <div className="mb-6">
          <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-green-600 mb-2">
            Order Successful!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for shopping with us!
          </p>
        </div>

        {orderInfo && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
              <p className="text-sm text-gray-600 mb-1">Your Order Number</p>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {orderInfo.order_number}
              </p>
              <p className="text-lg font-semibold text-gray-700">
                Total: ₦{orderInfo.total?.toLocaleString() || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-3">
                Save this order number for tracking and reference
              </p>
            </div>

            {/* Payment Method & Status */}
            <div
              className={`border rounded-lg p-4 mb-6 flex items-center justify-between ${getPaymentStatusColor()}`}
            >
              <div className="flex items-center gap-3">
                {getPaymentIcon()}
                <div className="text-left">
                  <p className="font-semibold text-sm">Payment Method</p>
                  <p className="text-lg font-bold">{getPaymentMethodText()}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/50">
                  {orderInfo.payment_status === "paid"
                    ? "✓ PAID"
                    : "⏳ PENDING"}
                </span>
              </div>
            </div>

          </>
        )}

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3 text-lg">
            What's Next?
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✓</span>
              <span>
                We'll send you a confirmation email with order details
              </span>
            </li>
            {(orderInfo?.payment_method === "paystack" ||
              orderInfo?.payment_method === "card") &&
            orderInfo?.payment_status === "paid" ? (
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span>
                  Your payment has been confirmed. We'll process your order
                  immediately!
                </span>
              </li>
            ) : null}
            <li className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✓</span>
              <span>Our team will verify your order within 24 hours</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✓</span>
              <span>You'll receive updates about your delivery status</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✓</span>
              <span>Contact us on WhatsApp if you have any questions</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            <FaWhatsapp className="mr-2 text-xl" />
            Contact Us on WhatsApp
          </a>

          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team or check your email for order
            details
          </p>
        </div>
      </div>
    </div>
  );
}

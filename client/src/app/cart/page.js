"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Plus,
  Minus,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart } = useCart(); // Assuming updateQuantity exists in your context
  const [imageErrors, setImageErrors] = useState({});

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50000 ? 0 : 2500; // Example logic: free shipping over 50k
  const total = subtotal + shipping;

  const handleImageError = (itemId) => {
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  const getItemId = (item) => item._id || item.id;

  const getItemImage = (item) => {
    const itemId = getItemId(item);
    if (imageErrors[itemId])
      return "https://via.placeholder.com/150?text=No+Image";
    if (item.images?.[0]) return item.images[0];
    if (item.image_url)
      return Array.isArray(item.image_url) ? item.image_url[0] : item.image_url;
    return item.image || "https://via.placeholder.com/150?text=No+Image";
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="bg-blue-50 p-8 rounded-full mb-6">
          <ShoppingBag className="h-16 w-16 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-8 text-center max-w-sm">
          Looks like you haven't added any auto parts to your cart yet. Let's
          find something for your vehicle!
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">
            You have {cart.length} items in your bag
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const itemId = getItemId(item);
              const itemImage = getItemImage(item);
              const itemName = item.name || item.product_name;

              return (
                <div
                  key={itemId}
                  className="group relative flex flex-col sm:flex-row items-center bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="relative w-full sm:w-32 h-32 mb-4 sm:mb-0 shrink-0 overflow-hidden rounded-xl border border-gray-100">
                    <img
                      src={itemImage}
                      alt={itemName}
                      onError={() => handleImageError(itemId)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="sm:ml-6 flex-1 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                          {itemName}
                        </h3>
                        {(item.brand || item.vehicle_make) && (
                          <p className="text-sm text-gray-500 font-medium">
                            {item.brand || item.vehicle_make} •{" "}
                            {item.model || item.vehicle_model}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button className="p-2 hover:bg-gray-50 text-gray-600">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-semibold">
                          {item.quantity}
                        </span>
                        <button className="p-2 hover:bg-gray-50 text-gray-600">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400 line-through">
                          ₦{(item.price * 1.1).toLocaleString()}
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <Link
              href="/"
              className="inline-flex items-center text-blue-600 font-medium hover:underline mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Link>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? "FREE" : `₦${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (VAT)</span>
                  <span className="font-semibold text-gray-900">
                    Calculated at checkout
                  </span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-black text-blue-600">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                >
                  <CreditCard className="w-5 h-5" />
                  Checkout Now
                </Link>
                <p className="text-center text-xs text-gray-400 px-4">
                  Secure checkout powered by industry standard encryption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

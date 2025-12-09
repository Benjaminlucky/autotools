"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-lg">
          Your cart is empty.{" "}
          <Link href="/" className="text-primary">
            Continue shopping
          </Link>
        </p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white shadow p-4 rounded-lg mb-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p>₦{item.price.toLocaleString()}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 text-right">
            <h2 className="text-2xl font-bold">
              Total: ₦{total.toLocaleString()}
            </h2>
            <Link
              href="/checkout"
              className="mt-4 inline-block bg-primary text-white px-6 py-3 rounded-lg"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

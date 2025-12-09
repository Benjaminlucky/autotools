"use client";
import CheckoutSteps from "@/components/checkoutSteps";
import { useRouter } from "next/navigation";

export default function ShippingPage() {
  const router = useRouter();

  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    localStorage.setItem("checkout-shipping", JSON.stringify(data));
    router.push("/checkout/payment");
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-xl">
      <CheckoutSteps step={1} />
      <h1 className="text-3xl font-bold mb-6">Shipping Address</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          name="address"
          required
          placeholder="Address"
          className="p-3 border w-full rounded-lg"
        />
        <div className="flex gap-4">
          <input
            name="city"
            required
            placeholder="City"
            className="p-3 border w-full rounded-lg"
          />
          <input
            name="state"
            required
            placeholder="State"
            className="p-3 border w-full rounded-lg"
          />
        </div>

        <select name="method" className="p-3 border w-full rounded-lg">
          <option value="standard">Standard Delivery - ₦2,500</option>
          <option value="express">Express Delivery - ₦5,500</option>
        </select>

        <button className="bg-primary text-white w-full py-3 rounded-lg text-lg">
          Continue →
        </button>
      </form>
    </div>
  );
}

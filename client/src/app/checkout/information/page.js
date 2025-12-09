"use client";
import CheckoutSteps from "@/components/checkoutSteps";
import { useRouter } from "next/navigation";

export default function InformationPage() {
  const router = useRouter();
  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    localStorage.setItem("checkout-info", JSON.stringify(data));
    router.push("/checkout/shipping");
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-xl">
      <CheckoutSteps step={0} />
      <h1 className="text-3xl font-bold mb-6">Contact Information</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          name="email"
          required
          placeholder="Email"
          className="p-3 border w-full rounded-lg"
        />
        <input
          name="phone"
          required
          placeholder="Phone Number"
          className="p-3 border w-full rounded-lg"
        />

        <button className="bg-primary text-white w-full py-3 rounded-lg text-lg">
          Continue →
        </button>
      </form>
    </div>
  );
}

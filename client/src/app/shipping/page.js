"use client";
import React, { useState } from "react";
import { Truck, MapPin, Home, ArrowRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const CURRENCY = "₦";

export default function ShippingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    deliveryType: "standard",
  });

  const shippingCost = form.deliveryType === "express" ? 5500 : 2500;

  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    localStorage.setItem("shippingDetails", JSON.stringify(form));
    router.push("/order-confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
        {/* Back */}
        <button
          className="flex items-center text-gray-600 hover:text-indigo-600 mb-6"
          onClick={() => router.back()}
        >
          <ChevronLeft className="mr-1 w-5" /> Back
        </button>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Shipping Information
        </h1>

        {/* Inputs */}
        <div className="grid gap-6">
          <input
            name="fullname"
            placeholder="Full Name"
            className="p-4 border rounded-xl w-full"
            onChange={updateForm}
          />
          <input
            name="phone"
            placeholder="Phone Number"
            className="p-4 border rounded-xl w-full"
            onChange={updateForm}
          />
          <input
            name="address"
            placeholder="Street Address"
            className="p-4 border rounded-xl w-full"
            onChange={updateForm}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              name="city"
              placeholder="City"
              className="p-4 border rounded-xl w-full"
              onChange={updateForm}
            />
            <input
              name="state"
              placeholder="State"
              className="p-4 border rounded-xl w-full"
              onChange={updateForm}
            />
          </div>
        </div>

        {/* Delivery Options */}
        <div className="mt-10 border-t pt-8">
          <h2 className="text-2xl font-bold mb-5 flex items-center">
            <Truck className="mr-2 w-6" /> Delivery Method
          </h2>

          <div className="grid gap-4">
            <label className="flex justify-between items-center p-4 border rounded-xl cursor-pointer">
              <div>
                <p className="font-semibold">Standard Delivery (2–5 Days)</p>
                <span className="text-gray-600">
                  Reliable Nationwide Dispatch
                </span>
              </div>
              <input
                type="radio"
                name="deliveryType"
                value="standard"
                checked={form.deliveryType === "standard"}
                onChange={updateForm}
              />
            </label>

            <label className="flex justify-between items-center p-4 border rounded-xl cursor-pointer">
              <div>
                <p className="font-semibold text-indigo-600">
                  Express Delivery (Same/Next Day)
                </p>
                <span className="text-gray-600">Fast Lagos/Abuja Priority</span>
              </div>
              <input
                type="radio"
                name="deliveryType"
                value="express"
                checked={form.deliveryType === "express"}
                onChange={updateForm}
              />
            </label>
          </div>

          <div className="text-right mt-6 text-lg font-bold">
            Shipping Fee: {CURRENCY}
            {shippingCost.toLocaleString()}
          </div>
        </div>

        {/* Continue */}
        <button
          onClick={handleContinue}
          className="w-full mt-10 py-4 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 text-lg hover:bg-indigo-700"
        >
          Continue to Order Summary <ArrowRight />
        </button>
      </div>
    </div>
  );
}

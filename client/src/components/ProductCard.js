// components/ProductCard.js
"use client";
import Link from "next/link";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);

  // Format currency
  const formatPrice = (price) => {
    if (price === undefined || price === null) return "N/A";
    return `₦${Number(price).toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 p-4 relative group">
      {/* Condition & Featured Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        <span
          className={`px-3 py-1 text-xs font-bold rounded-full shadow-md ${
            product.condition === "NEW"
              ? "bg-green-500 text-white"
              : "bg-gray-600 text-white"
          }`}
        >
          {product.condition}
        </span>
        {product.is_featured && (
          <span className="px-3 py-1 text-xs font-bold rounded-full shadow-md bg-yellow-400 text-gray-900">
            ⭐ FEATURED
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative overflow-hidden rounded-md mb-4 h-48">
        <img
          src={
            imageError
              ? "https://via.placeholder.com/300x200?text=No+Image"
              : product.image_url
          }
          alt={product.product_name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="mt-4">
        {/* Category */}
        <span className="text-sm uppercase text-blue-600 font-semibold">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="text-lg font-bold mt-1 line-clamp-2 min-h-[3.5rem]">
          {product.product_name}
        </h3>

        {/* Vehicle Information */}
        <div className="mt-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <span className="font-semibold">
              {product.vehicle_make} {product.vehicle_model}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-2 flex-wrap">
          {product.sub_category && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300">
              {product.sub_category}
            </span>
          )}
          {product.vendor_name && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
              {product.vendor_name}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mt-3 line-clamp-2 min-h-[2.5rem]">
          {product.description || "No description available"}
        </p>

        {/* Price & Link */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Price</p>
            <p className="text-xl font-bold text-green-600">
              {formatPrice(product.price)}
            </p>
          </div>
          <Link
            href={`/products/${product._id}`}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

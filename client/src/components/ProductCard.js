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
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
      <img
        src={
          imageError
            ? "https://via.placeholder.com/300x200?text=No+Image"
            : product.image_url
        }
        alt={product.product_name}
        onError={() => setImageError(true)}
        className="w-full h-48 object-cover rounded-md"
      />

      <div className="mt-4">
        {/* Category */}
        <span className="text-sm uppercase text-blue-600 font-semibold">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="text-lg font-bold mt-1">{product.product_name}</h3>

        {/* Sub-category & Vendor Tags */}
        <div className="flex gap-2 mt-2 flex-wrap">
          {product.sub_category && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300">
              {product.sub_category}
            </span>
          )}
          {product.vendor_name && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300">
              {product.vendor_name}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {product.description || "No description available"}
        </p>

        {/* Price & Link */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-bold text-blue-600">
            {formatPrice(product.price)}
          </p>
          <Link
            href={`/products/${product._id}`}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

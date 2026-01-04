// components/ProductGrid.js
"use client";
import { useState } from "react";
import useSWR from "swr";
import ProductCard from "./ProductCard";
import api from "@/lib/api.js";

// SWR Fetcher using the api instance
const fetcher = (url) => api.get(url).then((res) => res.data);

const ProductGrid = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch products from backend
  const { data, error, isLoading } = useSWR("/api/products", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  // Extract products from response
  const products = data?.products || [];

  // Extract unique categories from products dynamically
  const dynamicCategories = [
    "All",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  // Filter products based on active category
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Failed to Load Products
        </h3>
        <p className="text-red-600 mb-4">
          {error.message ||
            "Unable to connect to the server. Please try again later."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
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
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Products Available
        </h3>
        <p className="text-gray-500">
          Check back later for new auto parts and accessories!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Filter by Category
        </h3>
        <div className="flex flex-wrap gap-3">
          {dynamicCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
                activeCategory === category
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              {category}
              {category !== "All" && (
                <span className="ml-2 text-xs opacity-75">
                  ({products.filter((p) => p.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-gray-600">
        <p className="text-sm">
          Showing{" "}
          <span className="font-semibold">{filteredProducts.length}</span>{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
          {activeCategory !== "All" && (
            <span>
              {" "}
              in <span className="font-semibold">{activeCategory}</span>
            </span>
          )}
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            No Products Found
          </h3>
          <p className="text-gray-500 mb-4">
            No products match the selected category:{" "}
            <strong>{activeCategory}</strong>
          </p>
          <button
            onClick={() => setActiveCategory("All")}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

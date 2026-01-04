"use client";

import useSWR from "swr";
import ProductCard from "./ProductCard";
import api from "@/lib/api.js";

// SWR fetcher
const fetcher = (url) => api.get(url).then((res) => res.data);

export default function FeaturedProducts() {
  const { data, error, isLoading } = useSWR("/api/products", fetcher, {
    revalidateOnFocus: false,
  });

  // Extract & filter featured + published products
  const featuredProducts = (data?.products || []).filter(
    (product) => product.is_featured === true && product.status === "Published"
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load featured products.
      </div>
    );
  }

  // Empty state
  if (featuredProducts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No featured products available at the moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-10">
      {featuredProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

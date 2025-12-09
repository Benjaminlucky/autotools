// components/ProductGrid.js
"use client";
import { useState } from "react";
import ProductCard from "./ProductCard";

const ProductGrid = () => {
  const categories = [
    "All",
    "Brakes",
    "Engine",
    "Suspension",
    "Electrical",
    "Cooling",
    "Lighting",
    "Fuel System",
    "Interior",
    "Accessories",
    "Steering",
    "Transmission",
  ];

  const products = [
    {
      id: 1,
      name: "Brake Pad Set",
      category: "Brakes",
      description:
        "High quality ceramic brake pads for Toyota Camry 2015-2020.",
      price: 15000,
      image: "https://via.placeholder.com/300x200?text=Brake+Pad",
    },
    {
      id: 2,
      name: "Oil Filter Premium",
      category: "Engine",
      description: "Premium oil filter for Honda Accord, CR-V.",
      price: 5000,
      image: "https://via.placeholder.com/300x200?text=Oil+Filter",
    },
    {
      id: 3,
      name: "Iridium Spark Plug Set",
      category: "Engine",
      description: "Iridium spark plugs for better fuel efficiency.",
      price: 12000,
      image: "https://via.placeholder.com/300x200?text=Spark+Plug",
    },
    {
      id: 4,
      name: "Rear Shock Absorber",
      category: "Suspension",
      description: "Heavy-duty rear shock absorber for SUVs.",
      price: 45000,
      image: "https://via.placeholder.com/300x200?text=Shock+Absorber",
    },
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm border ${
              activeCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

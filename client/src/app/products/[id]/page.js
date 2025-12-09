"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaWhatsapp, FaStar, FaCarSide } from "react-icons/fa";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // ---------- Mock data (replace with API/DB) ----------
  const mockProducts = [
    {
      id: "1",
      name: "Brake Pad Set",
      category: "Brakes",
      description:
        "High-performance ceramic brake pads designed for excellent stopping power and durability.",
      price: 15000,
      stock: 12,
      brand: "Toyota",
      model: "Camry",
      year: "2007",
      images: [
        "https://via.placeholder.com/900x600?text=Brake+Pad+1",
        "https://via.placeholder.com/900x600?text=Brake+Pad+2",
        "https://via.placeholder.com/900x600?text=Brake+Pad+3",
      ],
      rating: 4.5,
    },
  ];

  const relatedProducts = [
    {
      id: "2",
      name: "Oil Filter Premium",
      category: "Engine",
      price: 5000,
      image: "https://via.placeholder.com/600x400?text=Oil+Filter",
    },
    {
      id: "3",
      name: "Iridium Spark Plug",
      category: "Engine",
      price: 12000,
      image: "https://via.placeholder.com/600x400?text=Spark+Plug",
    },
  ];
  // ----------------------------------------------------------

  useEffect(() => {
    const foundProduct =
      mockProducts.find((p) => p.id === id) || mockProducts[0];
    setProduct(foundProduct);
    setSelectedImage(foundProduct?.images?.[0] ?? "");
  }, [id]);

  if (!product)
    return <p className="text-center mt-10">Loading Product Details...</p>;

  // ----- WhatsApp link -----
  const whatsappMessage = `Hello, I'm interested in the ${product.name} for ${product.brand} ${product.model} ${product.year}. Is it available?`;
  const whatsappLink = `https://wa.me/2348135361267?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  // ----- Handle Add to Cart -----
  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${product.name} to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity); // temporary add
    router.push("/checkout"); // redirect to checkout
  };

  return (
    <div className="container mx-auto px-6 py-10 bg-background">
      <div className="bg-white rounded-xl shadow-md p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT - Image Gallery */}
        <div>
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg border cursor-zoom-in object-cover"
          />

          <div className="flex gap-3 mt-4">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setSelectedImage(img)}
                className={`w-24 h-24 object-cover rounded-md cursor-pointer ${
                  selectedImage === img
                    ? "border-2 border-primary shadow-lg"
                    : "border border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT - Product Info */}
        <div>
          <span className="text-sm uppercase text-primary font-medium tracking-wide">
            {product.category}
          </span>

          <h1 className="text-3xl font-bold mt-2 text-gray-900">
            {product.name}
          </h1>

          {/* Vehicle Pill Tag */}
          <div className="mt-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white text-xs rounded-full shadow-sm">
              <FaCarSide /> {product.brand} {product.model} {product.year}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center mt-4 text-accent">
            <FaStar className="mr-1" /> {product.rating} / 5.0
          </div>

          {/* Stock Indicator */}
          <p
            className={`mt-4 font-semibold ${
              product.stock > 0 ? "text-success" : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? `In Stock (${product.stock} available)`
              : "Out of Stock"}
          </p>

          {/* Description */}
          <p className="text-grayText mt-6 leading-relaxed">
            {product.description}
          </p>

          {/* Price */}
          <p className="text-3xl font-bold text-primary mt-6">
            ₦{product.price.toLocaleString()}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-6 mt-6 bg-gray-100 p-4 rounded-lg w-fit shadow-inner">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 text-xl bg-gray-200 rounded"
            >
              -
            </button>
            <span className="text-xl font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="px-3 py-1 text-xl bg-gray-200 rounded"
            >
              +
            </button>
          </div>

          {/* Shipping Info */}
          <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-sm text-sm text-grayText">
            🚚 <strong>Delivery:</strong> 2–5 business days <br />
            💳 <strong>Shipping Cost:</strong> ₦2,500 nationwide
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              href={whatsappLink}
              target="_blank"
              className="flex items-center justify-center px-6 py-3 bg-success text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              <FaWhatsapp className="mr-2" /> Chat on WhatsApp
            </a>

            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-accent text-white rounded-lg shadow hover:bg-amber-600 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primaryDark transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You may also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={item.image}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold mt-3">{item.name}</h3>
              <p className="text-primary font-bold mt-1">
                ₦{item.price.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOMER REVIEWS */}
      <div className="mt-16 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-md">
            ⭐⭐⭐⭐⭐
            <p className="mt-2 text-grayText">
              Great quality and fast shipping. Highly recommend!
            </p>
            <p className="text-sm text-gray-500 mt-2">— Adebayo, Lagos</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md">
            ⭐⭐⭐⭐
            <p className="mt-2 text-grayText">
              Works perfectly with my Toyota Camry.
            </p>
            <p className="text-sm text-gray-500 mt-2">— Kelvin, Abuja</p>
          </div>
        </div>
      </div>
    </div>
  );
}

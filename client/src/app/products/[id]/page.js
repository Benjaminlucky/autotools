"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FaWhatsapp,
  FaStar,
  FaCarSide,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import api from "@/lib/api.js";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FETCH PRODUCT BY ID =================
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/products/${id}`);
        const data = res.data.data;

        // Helper function to ensure images is always an array
        const normalizeImages = (imageData) => {
          if (Array.isArray(imageData) && imageData.length > 0) {
            return imageData;
          }
          if (typeof imageData === "string" && imageData.trim() !== "") {
            return [imageData];
          }
          return ["/placeholder.png"];
        };

        // Map backend fields → frontend-friendly shape
        const mappedProduct = {
          _id: data._id,
          name: data.product_name,
          category: data.category,
          description: data.description,
          price: data.price,
          stock: data.stock_quantity ?? 0,
          lowStockThreshold: data.low_stock_threshold ?? 5,
          trackInventory: data.track_inventory ?? true,
          brand: data.vehicle_make,
          model: data.vehicle_model,
          year: data.vehicle_year || "",
          condition: data.condition || "NEW",
          images: normalizeImages(data.image_url),
          rating: 4.5,
          whatsapp: data.vendor_whatsapp,
        };

        setProduct(mappedProduct);
        setSelectedImage(mappedProduct.images[0]);
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10">
        <p className="text-center mt-10 text-lg font-medium">
          Loading Product Details...
        </p>
      </div>
    );
  }

  // ================= ERROR STATE =================
  if (error || !product) {
    return (
      <div className="container mx-auto px-6 py-10">
        <p className="text-center mt-10 text-red-500">Product not found</p>
      </div>
    );
  }

  // ================= STOCK CALCULATIONS =================
  const isInStock = product.stock > 0;
  const isLowStock = isInStock && product.stock <= product.lowStockThreshold;
  const maxQuantity = Math.min(product.stock, 10); // Limit to 10 or available stock

  // ================= STOCK STATUS BADGE =================
  const getStockBadge = () => {
    if (!isInStock) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg font-semibold">
          <FaTimesCircle /> Out of Stock
        </div>
      );
    }

    if (isLowStock) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold">
          <FaExclamationTriangle /> Low Stock - Only {product.stock} left!
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
        <FaCheckCircle /> In Stock ({product.stock} available)
      </div>
    );
  };

  // ================= WHATSAPP =================
  const whatsappMessage = `Hello, I'm interested in the ${product.name} for ${product.brand} ${product.model}. Is it available?`;
  const whatsappLink = `https://wa.me/${
    product.whatsapp
  }?text=${encodeURIComponent(whatsappMessage)}`;

  // ================= CART =================
  const handleAddToCart = () => {
    if (!isInStock) {
      toast.error("This product is out of stock");
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} units available`);
      return;
    }

    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleBuyNow = () => {
    if (!isInStock) {
      toast.error("This product is out of stock");
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} units available`);
      return;
    }

    addToCart(product, quantity);
    router.push("/checkout");
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      setQuantity(1);
    } else if (newQuantity > maxQuantity) {
      setQuantity(maxQuantity);
      toast.info(`Maximum ${maxQuantity} units can be ordered`);
    } else {
      setQuantity(newQuantity);
    }
  };

  // ================= RENDER =================
  return (
    <div className="container mx-auto px-6 py-10 bg-background">
      <div className="bg-white rounded-xl shadow-md p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT - Image Gallery */}
        <div>
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg border object-cover"
          />

          <div className="flex gap-3 mt-4">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} - view ${idx + 1}`}
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
          <span className="text-sm uppercase text-primary font-medium">
            {product.category}
          </span>

          <h1 className="text-3xl font-bold mt-2 text-gray-900">
            {product.name}
          </h1>

          {/* Vehicle Tag */}
          <div className="mt-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white text-xs rounded-full">
              <FaCarSide /> {product.brand} {product.model}
            </span>
            <span
              className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                product.condition === "NEW"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {product.condition}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center mt-4 text-accent">
            <FaStar className="mr-1" /> {product.rating} / 5.0
          </div>

          {/* Stock Status */}
          <div className="mt-4">{getStockBadge()}</div>

          {/* Description */}
          <p className="text-grayText mt-6">{product.description}</p>

          {/* Price */}
          <p className="text-3xl font-bold text-primary mt-6">
            ₦{product.price.toLocaleString()}
          </p>

          {/* Quantity Selector - Only show if in stock */}
          {isInStock && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity {product.stock < 10 && `(Max: ${product.stock})`}
              </label>
              <div className="flex items-center gap-6 bg-gray-100 p-4 rounded-lg w-fit">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= maxQuantity}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {quantity >= maxQuantity && product.stock < 10 && (
                <p className="text-sm text-yellow-600 mt-2">
                  Maximum available quantity selected
                </p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {product.whatsapp && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-6 py-3 bg-success text-white rounded-lg hover:bg-green-700 transition"
              >
                <FaWhatsapp className="mr-2" /> Chat on WhatsApp
              </a>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
              title={!isInStock ? "Out of stock" : "Add to cart"}
            >
              {isInStock ? "Add to Cart" : "Out of Stock"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!isInStock}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
              title={!isInStock ? "Out of stock" : "Buy now"}
            >
              {isInStock ? "Buy Now" : "Unavailable"}
            </button>
          </div>

          {/* Additional Info for Out of Stock */}
          {!isInStock && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Out of Stock:</strong> This product is currently
                unavailable. Contact us via WhatsApp for restock information or
                alternative options.
              </p>
            </div>
          )}

          {/* Low Stock Warning */}
          {isLowStock && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Hurry!</strong> Only {product.stock} units left in
                stock. Order now to secure yours!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

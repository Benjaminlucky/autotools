import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md"
      />

      <div className="mt-4">
        {/* Category */}
        <span className="text-sm uppercase text-primary font-semibold">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="text-lg font-bold mt-1">{product.name}</h3>

        {/* Brand & Model Tags */}
        <div className="flex gap-2 mt-2 flex-wrap">
          <span className="px-2 py-1 bg-background text-grayText text-xs rounded-full border">
            {product.brand}
          </span>
          <span className="px-2 py-1 bg-background text-grayText text-xs rounded-full border">
            {product.model}
          </span>
          <span className="px-2 py-1 bg-background text-grayText text-xs rounded-full border">
            {product.year}
          </span>
        </div>

        {/* Description */}
        <p className="text-grayText text-sm mt-2 line-clamp-2">
          {product.description}
        </p>

        {/* Price & Link */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-bold text-primary">
            ₦{product.price.toLocaleString()}
          </p>
          <Link
            href={`/products/${product.id}`}
            className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-accent transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

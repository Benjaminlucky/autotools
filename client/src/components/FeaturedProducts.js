// components/FeaturedProducts.js
import ProductCard from "./ProductCard";

const sampleProducts = [
  {
    id: 1,
    name: "Brake Pad Set",
    category: "Brakes",
    description: "High quality ceramic brake pads for Toyota Camry 2015-2020",
    price: 15000,
    image: "/images/brake.jpg",
  },
  {
    id: 2,
    name: "Oil Filter Premium",
    category: "Engine",
    description: "Premium oil filter for Honda Accord, CR-V, and Civic",
    price: 5000,
    image: "/images/oilfilter.jpg",
  },
  {
    id: 3,
    name: "Iridium Spark Plug Set",
    category: "Engine",
    description: "Better fuel efficiency (Set of 4)",
    price: 12000,
    image: "/images/sparkplug.jpg",
  },
  {
    id: 4,
    name: "Rear Shock Absorber",
    category: "Suspension",
    description: "Heavy-duty shock absorber for SUVs and trucks",
    price: 45000,
    image: "/images/shock.jpg",
  },
];

export default function FeaturedProducts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-10">
      {sampleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

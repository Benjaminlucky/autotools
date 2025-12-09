// pages/index.js
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import SectionTitle from "../components/SectionTitle";
import FeaturedProducts from "../components/FeaturedProducts";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <HeroSection />

        <SectionTitle
          title="Featured Products"
          linkText="View All"
          linkHref="/products"
        />

        <FeaturedProducts />
        <div className="container mx-auto px-4 py-24">
          <h1 className="text-3xl font-bold mb-6">All Products</h1>
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}

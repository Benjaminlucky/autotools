// components/HeroSection.js
export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 rounded-2xl shadow-lg mx-4 md:mx-10 mt-6">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Premium Auto Parts</h1>
        <p className="text-lg mb-6">
          Find the best parts for your vehicle at unbeatable prices.
        </p>
        <button className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg shadow hover:bg-gray-100">
          Shop Now
        </button>
      </div>
    </section>
  );
}

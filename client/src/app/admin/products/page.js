"use client";

import { useState } from "react";
import useSWR from "swr";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import AdminDashboard from "../dashboard/page";
import axios from "axios";
import { toast } from "react-toastify";

// Define a common currency formatter for consistency
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "N/A";
  // Assuming ₦ is the Nigerian Naira symbol
  return `₦${Number(amount).toLocaleString()}`;
};

const theme = {
  colorPrimary: "#1e3a8a", // Blue-900
  colorAccent: "#f59e0b", // Amber-500
  colorButton: "#1e3a8a",
};

// SWR Fetcher
const fetcher = (url) => axios.get(url).then((res) => res.data);

// Modal Initial Form
const initialForm = {
  product_name: "",
  price: "",
  category: "",
  sub_category: "",
  image_url: "",
  description: "",
  vendor_name: "",
  vendor_phone: "",
  vendor_whatsapp: "",
  cost_price: "",
};

// Input Component (Updated styling)
const FormInput = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <input
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className="w-full px-4 py-3 border rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:ring-1 transition duration-150 ease-in-out"
    style={{
      "--tw-ring-color": theme.colorAccent,
      borderColor: value && required && !value.trim() ? "red" : "",
    }}
  />
);

// Add Product Modal (Updated styling for a modern look)
function AddProductModal({ open, onClose, mutate }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // NOTE: Make sure the price and cost_price are numbers if your API expects them to be
      const productData = {
        ...form,
        price: Number(form.price),
        cost_price: Number(form.cost_price),
      };
      await axios.post("http://localhost:5000/api/products", productData);
      toast.success("Product created successfully! 🎉");
      mutate();
      setForm(initialForm);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl transform transition-transform duration-300 scale-100"
      >
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FaTimes className="text-gray-500 hover:text-red-600 text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Details Section */}
          <h3 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4">
            Product Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="product_name"
              required
              placeholder="Product Name"
              value={form.product_name}
              onChange={handleChange}
            />
            <FormInput
              name="price"
              required
              type="number"
              placeholder="Sale Price (₦)"
              value={form.price}
              onChange={handleChange}
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:ring-1 transition duration-150 ease-in-out"
              style={{ "--tw-ring-color": theme.colorAccent }}
            >
              <option value="">Select Category</option>
              <option value="Brakes">Brakes</option>
              <option value="Engine">Engine</option>
              <option value="Electronics">Electronics</option>
            </select>
            <FormInput
              name="sub_category"
              placeholder="Sub Category (e.g., Pads, Oil Filters)"
              value={form.sub_category}
              onChange={handleChange}
            />
          </div>

          <FormInput
            name="image_url"
            required
            placeholder="Image URL (e.g., https://example.com/image.jpg)"
            value={form.image_url}
            onChange={handleChange}
          />

          <textarea
            name="description"
            required
            value={form.description}
            onChange={handleChange}
            placeholder="Detailed Product Description"
            rows="5"
            className="w-full px-4 py-3 border rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:ring-1 transition duration-150 ease-in-out resize-none"
            style={{ "--tw-ring-color": theme.colorAccent }}
          ></textarea>

          {/* Vendor Section */}
          <h3 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4 pt-4">
            Vendor & Cost Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="vendor_name"
              placeholder="Vendor Name"
              value={form.vendor_name}
              onChange={handleChange}
            />
            <FormInput
              name="cost_price"
              type="number"
              placeholder="Cost Price (₦)"
              value={form.cost_price}
              onChange={handleChange}
            />
            <FormInput
              name="vendor_phone"
              placeholder="Vendor Phone (080...)"
              value={form.vendor_phone}
              onChange={handleChange}
            />
            <FormInput
              name="vendor_whatsapp"
              placeholder="Vendor WhatsApp"
              value={form.vendor_whatsapp}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            style={{ backgroundColor: theme.colorButton }}
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

// MAIN PAGE (Enhanced with modern layout and mobile-responsive table)
export default function AdminProductsPage() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, mutate, isLoading, error } = useSWR(
    "http://localhost:5000/api/products",
    fetcher
  );

  let products = data?.products || [];

  // Filtering Logic
  if (searchTerm) {
    products = products.filter(
      (p) =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sub_category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Define table headers
  const tableHeaders = ["Image", "Name", "Category", "Price", "Actions"];

  // Helper for Product Card View (Mobile)
  const ProductCard = ({ p }) => (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-4 last:mb-0 transition duration-150 hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        {/* Product Image and Name */}
        <div className="flex items-center space-x-3">
          <img
            src={p.image_url}
            alt={p.product_name}
            className="w-14 h-14 rounded-full object-cover border border-gray-100 flex-shrink-0"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/80?text=Image";
            }}
          />
          <div>
            <div className="font-bold text-lg text-gray-800">
              {p.product_name}
            </div>
            <div className="text-sm text-gray-500">
              {p.category} {p.sub_category && ` / ${p.sub_category}`}
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="text-xl font-extrabold text-green-600">
          {formatCurrency(p.price)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 border-t pt-3 mt-3">
        <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full bg-blue-50">
          <FaEdit />
        </button>
        <button className="text-red-600 hover:text-red-800 p-2 rounded-full bg-red-50">
          <FaTrash />
        </button>
      </div>
    </div>
  );

  return (
    <AdminDashboard>
      <div className="container mx-auto p-4 md:p-6">
        {/* Header & Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
          <h1
            className="text-4xl font-extrabold mb-3 sm:mb-0 text-gray-800"
            style={{ color: theme.colorPrimary }}
          >
            Product Inventory
          </h1>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center space-x-2 bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-200 shadow-lg shadow-blue-200"
            style={{ backgroundColor: theme.colorButton }}
          >
            <FaPlus className="text-lg" /> <span>Add New Product</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search by product name, category, or sub-category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl bg-white shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center py-10 text-gray-500 font-medium">
            Loading products... ⚙️
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg">
            Failed to load products. Please check the server connection. 😥
          </div>
        )}

        {/* --- Mobile View: Product Cards (Default) --- */}
        <div className="block lg:hidden">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Products ({products.length})
          </h2>
          {products.length === 0 && !isLoading && !error ? (
            <div className="text-center py-8 text-gray-500 bg-white rounded-xl shadow-md">
              No products found matching your search.
            </div>
          ) : (
            products.map((p) => <ProductCard key={p._id} p={p} />)
          )}
        </div>

        {/* --- Desktop View: Products Table (lg: block) --- */}
        <div className="hidden lg:block bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                {tableHeaders.map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.map((p, index) => (
                <tr
                  key={p._id}
                  className={`transition duration-150 ease-in-out ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={p.image_url}
                      alt={p.product_name}
                      className="w-14 h-14 rounded-lg object-cover border border-gray-200 shadow-sm"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/80?text=No+Image";
                      }}
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-semibold text-gray-900">
                      {p.product_name}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full bg-indigo-100 text-indigo-800">
                      {p.category}
                    </span>
                    {p.sub_category && (
                      <div className="text-xs text-gray-500 mt-1">
                        {p.sub_category}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-green-700">
                    {formatCurrency(p.price)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap space-x-3">
                    <button className="text-blue-600 hover:text-white hover:bg-blue-600 p-2 rounded-full transition duration-150">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-white hover:bg-red-600 p-2 rounded-full transition duration-150">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}

              {products.length === 0 && !isLoading && !error && (
                <tr>
                  <td
                    className="text-center py-10 text-gray-500 font-medium"
                    colSpan={tableHeaders.length}
                  >
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AddProductModal
          open={open}
          onClose={() => setOpen(false)}
          mutate={mutate}
        />
      </div>
    </AdminDashboard>
  );
}

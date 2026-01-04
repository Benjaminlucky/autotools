"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import AdminDashboard from "../dashboard/page";
import { toast } from "react-toastify";
import api from "@/lib/api.js";

// Define a common currency formatter for consistency
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "N/A";
  return `₦${Number(amount).toLocaleString()}`;
};

const theme = {
  colorPrimary: "#1e3a8a",
  colorAccent: "#f59e0b",
  colorButton: "#1e3a8a",
};

// SWR Fetcher using the api instance
const fetcher = (url) => api.get(url).then((res) => res.data);

// Modal Initial Form
const initialForm = {
  product_name: "",
  price: "",
  category: "",
  sub_category: "",
  image_url: "",
  description: "",
  condition: "NEW",
  vehicle_make: "",
  vehicle_model: "",
  is_featured: false,
  status: "DRAFT",
  vendor_name: "",
  vendor_phone: "",
  vendor_whatsapp: "",
  cost_price: "",
};

// Input Component
const FormInput = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => {
  const isEmptyRequired =
    required && typeof value === "string" && value.trim().length === 0;

  return (
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
        borderColor: isEmptyRequired ? "red" : "",
      }}
    />
  );
};

// Edit Product Modal
function EditProductModal({ open, onClose, product, mutate }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && open) {
      setForm({
        product_name: product.product_name || "",
        price: product.price || "",
        category: product.category || "",
        sub_category: product.sub_category || "",
        image_url: product.image_url || "",
        description: product.description || "",
        condition: product.condition || "NEW",
        vehicle_make: product.vehicle_make || "",
        vehicle_model: product.vehicle_model || "",
        is_featured: product.is_featured || false,
        status: product.status || "DRAFT",
        vendor_name: product.vendor_name || "",
        vendor_phone: product.vendor_phone || "",
        vendor_whatsapp: product.vendor_whatsapp || "",
        cost_price: product.cost_price || "",
      });
    }
  }, [product, open]);

  if (!open || !product) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...form,
        price: Number(form.price),
        cost_price: form.cost_price ? Number(form.cost_price) : undefined,
      };
      await api.put(`/api/products/${product._id}`, productData);
      toast.success("Product updated successfully! 🎉");
      mutate();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
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
          <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
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
            >
              <option value="">Select Category</option>
              <option value="Brakes">Brakes</option>
              <option value="Engine">Engine</option>
              <option value="Suspension">Suspension</option>
              <option value="Electrical">Electrical</option>
              <option value="Body">Body</option>
              <option value="Other">Other</option>
            </select>
            <FormInput
              name="sub_category"
              placeholder="Sub Category (e.g., Pads, Oil Filters)"
              value={form.sub_category}
              onChange={handleChange}
            />
          </div>

          {/* Vehicle Information */}
          <h3 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4 pt-4">
            Vehicle Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              name="vehicle_make"
              required
              placeholder="Vehicle Make (e.g., Toyota)"
              value={form.vehicle_make}
              onChange={handleChange}
            />
            <FormInput
              name="vehicle_model"
              required
              placeholder="Vehicle Model (e.g., Camry)"
              value={form.vehicle_model}
              onChange={handleChange}
            />
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:ring-1 transition duration-150 ease-in-out"
            >
              <option value="NEW">NEW</option>
              <option value="USED">USED</option>
            </select>
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
          ></textarea>

          {/* Product Settings */}
          <h3 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4 pt-4">
            Product Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label className="text-gray-700 font-medium">
                Featured Product
              </label>
            </div>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:ring-1 transition duration-150 ease-in-out"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

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
          >
            {loading ? "Updating Product..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Add Product Modal
function AddProductModal({ open, onClose, mutate }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...form,
        price: Number(form.price),
        cost_price: form.cost_price ? Number(form.cost_price) : undefined,
      };
      await api.post("/api/products", productData);
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
            >
              <option value="">Select Category</option>
              <option value="Brakes">Brakes</option>
              <option value="Engine">Engine</option>
              <option value="Suspension">Suspension</option>
              <option value="Electrical">Electrical</option>
              <option value="Body">Body</option>
              <option value="Other">Other</option>
            </select>
            <FormInput
              name="sub_category"
              placeholder="Sub Category (e.g., Pads, Oil Filters)"
              value={form.sub_category}
              onChange={handleChange}
            />
          </div>

          {/* Vehicle Information */}
          <h3 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4 pt-4">
            Vehicle Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              name="vehicle_make"
              required
              placeholder="Vehicle Make (e.g., Toyota)"
              value={form.vehicle_make}
              onChange={handleChange}
            />
            <FormInput
              name="vehicle_model"
              required
              placeholder="Vehicle Model (e.g., Camry)"
              value={form.vehicle_model}
              onChange={handleChange}
            />
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:ring-1 transition duration-150 ease-in-out"
            >
              <option value="NEW">NEW</option>
              <option value="USED">USED</option>
            </select>
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
          ></textarea>

          {/* Product Settings */}
          <h3 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4 pt-4">
            Product Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label className="text-gray-700 font-medium">
                Featured Product
              </label>
            </div>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:ring-1 transition duration-150 ease-in-out"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

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
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  productName,
  loading,
}) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Confirm Deletion
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{productName}</strong>? This
          action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// View Product Modal
function ViewProductModal({ open, onClose, product }) {
  if (!open || !product) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FaTimes className="text-gray-500 hover:text-red-600 text-xl" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <img
              src={product.image_url}
              alt={product.product_name}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x300?text=No+Image";
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Product Name</p>
              <p className="font-semibold">{product.product_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Price</p>
              <p className="font-semibold text-green-600">
                {formatCurrency(product.price)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-semibold">{product.category}</p>
            </div>
            <div>
              <p className="text-gray-500">Sub Category</p>
              <p className="font-semibold">{product.sub_category || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Vehicle Make</p>
              <p className="font-semibold">{product.vehicle_make}</p>
            </div>
            <div>
              <p className="text-gray-500">Vehicle Model</p>
              <p className="font-semibold">{product.vehicle_model}</p>
            </div>
            <div>
              <p className="text-gray-500">Condition</p>
              <p className="font-semibold">{product.condition}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  product.status === "PUBLISHED"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {product.status}
              </span>
            </div>
            <div>
              <p className="text-gray-500">Featured</p>
              <p className="font-semibold">
                {product.is_featured ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Vendor</p>
              <p className="font-semibold">{product.vendor_name || "N/A"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 mb-2">Description</p>
              <p className="text-gray-700">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// MAIN PAGE
export default function AdminProductsPage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data, mutate, isLoading, error } = useSWR("/api/products", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  let products = data?.products || [];

  // Filtering Logic
  if (searchTerm) {
    products = products.filter(
      (p) =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sub_category &&
          p.sub_category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.vehicle_make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.vehicle_model.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Handle Edit
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenEdit(true);
  };

  // Handle View
  const handleView = (product) => {
    setSelectedProduct(product);
    setOpenView(true);
  };

  // Handle Delete Confirmation
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setOpenDelete(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!selectedProduct) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/api/products/${selectedProduct._id}`);
      toast.success("Product deleted successfully! 🗑️");
      mutate();
      setOpenDelete(false);
      setSelectedProduct(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle Publish/Draft Toggle
  const handleStatusToggle = async (product) => {
    const newStatus = product.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    try {
      await api.patch(`/api/products/${product._id}/status`, {
        status: newStatus,
      });
      toast.success(`Product ${newStatus.toLowerCase()} successfully! ✅`);
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  // Define table headers
  const tableHeaders = [
    "Image",
    "Name",
    "Vehicle",
    "Category",
    "Condition",
    "Price",
    "Status",
    "Actions",
  ];

  // Helper for Product Card View (Mobile)
  const ProductCard = ({ p }) => (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-4 last:mb-0 transition duration-150 hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
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
              {p.vehicle_make} {p.vehicle_model}
            </div>
            <div className="text-xs text-gray-400">
              {p.category} • {p.condition}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-extrabold text-green-600">
            {formatCurrency(p.price)}
          </div>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${
              p.status === "PUBLISHED"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {p.status}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-2 border-t pt-3 mt-3">
        <button
          onClick={() => handleView(p)}
          className="text-gray-600 hover:text-gray-800 p-2 rounded-full bg-gray-50"
          title="View"
        >
          <FaEye />
        </button>
        <button
          onClick={() => handleEdit(p)}
          className="text-blue-600 hover:text-blue-800 p-2 rounded-full bg-blue-50"
          title="Edit"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => handleStatusToggle(p)}
          className={`p-2 rounded-full ${
            p.status === "PUBLISHED"
              ? "text-yellow-600 hover:text-yellow-800 bg-yellow-50"
              : "text-green-600 hover:text-green-800 bg-green-50"
          }`}
          title={p.status === "PUBLISHED" ? "Draft" : "Publish"}
        >
          {p.status === "PUBLISHED" ? <FaTimesCircle /> : <FaCheckCircle />}
        </button>
        <button
          onClick={() => handleDeleteClick(p)}
          className="text-red-600 hover:text-red-800 p-2 rounded-full bg-red-50"
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );

  return (
    <AdminDashboard>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
          <h1
            className="text-4xl font-extrabold mb-3 sm:mb-0 text-gray-800"
            style={{ color: theme.colorPrimary }}
          >
            Product Inventory
          </h1>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center space-x-2 bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-200 shadow-lg shadow-blue-200"
            style={{ backgroundColor: theme.colorButton }}
          >
            <FaPlus className="text-lg" /> <span>Add New Product</span>
          </button>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search by product name, category, vehicle make or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl bg-white shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>

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
                    {p.is_featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {p.vehicle_make}
                    </div>
                    <div className="text-xs text-gray-500">
                      {p.vehicle_model}
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

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        p.condition === "NEW"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {p.condition}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-green-700">
                    {formatCurrency(p.price)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        p.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleView(p)}
                      className="text-gray-600 hover:text-white hover:bg-gray-600 p-2 rounded-full transition duration-150"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-600 hover:text-white hover:bg-blue-600 p-2 rounded-full transition duration-150"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleStatusToggle(p)}
                      className={`p-2 rounded-full transition duration-150 ${
                        p.status === "PUBLISHED"
                          ? "text-yellow-600 hover:text-white hover:bg-yellow-600"
                          : "text-green-600 hover:text-white hover:bg-green-600"
                      }`}
                      title={p.status === "PUBLISHED" ? "Draft" : "Publish"}
                    >
                      {p.status === "PUBLISHED" ? (
                        <FaTimesCircle />
                      ) : (
                        <FaCheckCircle />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(p)}
                      className="text-red-600 hover:text-white hover:bg-red-600 p-2 rounded-full transition duration-150"
                      title="Delete"
                    >
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
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          mutate={mutate}
        />

        <EditProductModal
          open={openEdit}
          onClose={() => {
            setOpenEdit(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          mutate={mutate}
        />

        <ViewProductModal
          open={openView}
          onClose={() => {
            setOpenView(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />

        <DeleteConfirmModal
          open={openDelete}
          onClose={() => {
            setOpenDelete(false);
            setSelectedProduct(null);
          }}
          onConfirm={handleDelete}
          productName={selectedProduct?.product_name}
          loading={deleteLoading}
        />
      </div>
    </AdminDashboard>
  );
}

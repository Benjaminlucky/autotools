"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api.js";
import toast from "react-hot-toast";
import AdminDashboard from "../dashboard/page";
import {
  Package,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  X,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    payment_status: "",
    search: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.payment_status)
        params.append("payment_status", filters.payment_status);

      const response = await api.get(`/api/orders?${params.toString()}`);
      if (response.data.success) {
        let fetchedOrders = response.data.orders;

        // Apply search filter on frontend
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          fetchedOrders = fetchedOrders.filter(
            (order) =>
              order.order_number?.toLowerCase().includes(searchLower) ||
              order.customer?.email?.toLowerCase().includes(searchLower) ||
              order.customer?.phone?.includes(filters.search)
          );
        }

        setOrders(fetchedOrders);
        calculateStats(fetchedOrders);
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersList) => {
    setStats({
      total: ordersList.length,
      pending: ordersList.filter((o) => o.status === "pending").length,
      confirmed: ordersList.filter((o) => o.status === "confirmed").length,
      shipped: ordersList.filter((o) => o.status === "shipped").length,
      delivered: ordersList.filter((o) => o.status === "delivered").length,
    });
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      if (response.data.success) {
        setSelectedOrder(response.data.data);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Fetch order details error:", error);
      toast.error("Failed to fetch order details");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.patch(`/api/orders/${orderId}/status`, {
        status: newStatus,
      });

      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(response.data.data);
        }
      }
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Failed to update order status");
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      const response = await api.patch(`/api/orders/${orderId}/payment`, {
        payment_status: paymentStatus,
      });

      if (response.data.success) {
        toast.success(`Payment status updated to ${paymentStatus}`);
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(response.data.data);
        }
      }
    } catch (error) {
      console.error("Update payment error:", error);
      toast.error("Failed to update payment status");
    }
  };

  const addTrackingNumber = async (orderId, trackingNumber) => {
    try {
      const response = await api.patch(`/api/orders/${orderId}/tracking`, {
        tracking_number: trackingNumber,
      });

      if (response.data.success) {
        toast.success("Tracking number added successfully");
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(response.data.data);
        }
      }
    } catch (error) {
      console.error("Add tracking error:", error);
      toast.error("Failed to add tracking number");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <AdminDashboard>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Orders Management
          </h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.confirmed}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {stats.shipped}
                </p>
              </div>
              <Truck className="w-8 h-8 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.delivered}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order #, email, phone..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Order Status Filter */}
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Order Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={filters.payment_status}
              onChange={(e) =>
                setFilters({ ...filters, payment_status: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Payment Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() =>
                setFilters({ status: "", payment_status: "", search: "" })
              }
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search criteria
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {order.order_number}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.item_count || order.items?.length || 0} items
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {order.shipping?.full_name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.customer?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {order.items?.length || 0} item(s)
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-semibold text-gray-900">
                          ₦{order.total?.toLocaleString() || "0"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(
                            order.payment?.status
                          )}`}
                        >
                          {order.payment?.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => viewOrderDetails(order._id)}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedOrder.order_number}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status Actions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Update Order Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "pending",
                    "confirmed",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updateOrderStatus(selectedOrder._id, status)
                      }
                      disabled={selectedOrder.status === status}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                        selectedOrder.status === status
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Status Actions */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Update Payment Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["pending", "paid", "failed", "refunded"].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updatePaymentStatus(selectedOrder._id, status)
                      }
                      disabled={selectedOrder.payment?.status === status}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                        selectedOrder.payment?.status === status
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tracking Number */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Tracking Number
                </h3>
                {selectedOrder.tracking_number ? (
                  <p className="text-gray-900 font-mono">
                    {selectedOrder.tracking_number}
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter tracking number"
                      id="tracking-input"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById("tracking-input");
                        if (input.value.trim()) {
                          addTrackingNumber(
                            selectedOrder._id,
                            input.value.trim()
                          );
                        }
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Email:</strong> {selectedOrder.customer?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedOrder.customer?.phone}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-red-600" />
                    Shipping Address
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedOrder.shipping?.full_name}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {selectedOrder.shipping?.address}
                    </p>
                    <p>
                      <strong>City:</strong> {selectedOrder.shipping?.city},{" "}
                      {selectedOrder.shipping?.state}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Order Items
                </h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.product_name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            ₦{item.price?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                            ₦{item.subtotal?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      ₦{selectedOrder.subtotal?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Fee:</span>
                    <span className="font-medium">
                      ₦{selectedOrder.shipping_fee?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">
                      ₦{selectedOrder.tax?.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-lg">Total:</span>
                      <span className="font-bold text-xl text-green-600">
                        ₦{selectedOrder.total?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Notes */}
              {selectedOrder.delivery_notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Delivery Notes
                  </h3>
                  <p className="text-sm text-gray-700">
                    {selectedOrder.delivery_notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminDashboard>
  );
}

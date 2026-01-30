// src/controllers/order.controller.js

import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Create new order
export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      shipping,
      items,
      payment,
      shipping_fee,
      tax,
      delivery_notes,
    } = req.body;

    // Validate required fields
    console.log("Received order creation request:", JSON.stringify(req.body, null, 2));

    if (!customer || !customer.email || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: "Customer information is required",
      });
    }

    if (
      !shipping ||
      !shipping.full_name ||
      !shipping.address ||
      !shipping.city ||
      !shipping.state
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping information is required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // Validate stock availability and prepare order items
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product_name}`,
        });
      }

      // Check stock availability
      if (product.track_inventory && product.stock_quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.product_name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`,
        });
      }

      orderItems.push({
        product_id: product._id,
        product_name: product.product_name,
        price: product.price,
        quantity: item.quantity,
        image_url: product.image_url,
        vehicle_make: product.vehicle_make,
        vehicle_model: product.vehicle_model,
        subtotal: product.price * item.quantity,
      });

      // Reduce stock quantity
      if (product.track_inventory) {
        product.stock_quantity -= item.quantity;
        await product.save();
      }
    }

    // Create order
    const order = await Order.create({
      customer,
      shipping,
      items: orderItems,
      payment: {
        method: payment?.method || "cash_on_delivery",
        status: payment?.status || "pending",
        transaction_id: payment?.transaction_id || undefined,
      },
      shipping_fee: shipping_fee || 0,
      tax: tax || 0,
      delivery_notes,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { status, payment_status, limit = 50, page = 1 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (payment_status) query["payment.status"] = payment_status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate("items.product_id", "product_name category");

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id).populate(
      "items.product_id",
      "product_name category vehicle_make vehicle_model"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order",
    });
  }
};

// Get order by order number
export const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ order_number: orderNumber }).populate(
      "items.product_id",
      "product_name category"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order",
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const updateData = { status };

    // Set timestamp based on status
    if (status === "confirmed") updateData.confirmed_at = new Date();
    if (status === "shipped") updateData.shipped_at = new Date();
    if (status === "delivered") updateData.delivered_at = new Date();
    if (status === "cancelled") updateData.cancelled_at = new Date();

    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, transaction_id } = req.body;

    const validPaymentStatuses = ["pending", "paid", "failed", "refunded"];

    if (!validPaymentStatuses.includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const updateData = {
      "payment.status": payment_status,
    };

    if (transaction_id) {
      updateData["payment.transaction_id"] = transaction_id;
    }

    if (payment_status === "paid") {
      updateData["payment.paid_at"] = new Date();
    }

    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${payment_status}`,
      data: order,
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update payment status",
    });
  }
};

// Add tracking number
export const addTrackingNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { tracking_number } = req.body;

    if (!tracking_number) {
      return res.status(400).json({
        success: false,
        message: "Tracking number is required",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { tracking_number },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tracking number added successfully",
      data: order,
    });
  } catch (error) {
    console.error("Add tracking number error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add tracking number",
    });
  }
};

// Delete order (admin only)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Restore stock for cancelled orders
    if (order.status !== "delivered") {
      for (const item of order.items) {
        const product = await Product.findById(item.product_id);
        if (product && product.track_inventory) {
          product.stock_quantity += item.quantity;
          await product.save();
        }
      }
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete order",
    });
  }
};

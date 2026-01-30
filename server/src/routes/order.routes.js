// src/routes/order.routes.js

import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  updatePaymentStatus,
  addTrackingNumber,
  deleteOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

// Create new order
router.post("/", createOrder);

// Get all orders (with optional filters)
router.get("/", getAllOrders);

// Get order by order number
router.get("/number/:orderNumber", getOrderByNumber);

// Get order by ID
router.get("/:id", getOrderById);

// Update order status
router.patch("/:id/status", updateOrderStatus);

// Update payment status
router.patch("/:id/payment", updatePaymentStatus);

// Add tracking number
router.patch("/:id/tracking", addTrackingNumber);

// Delete order
router.delete("/:id", deleteOrder);

export default router;

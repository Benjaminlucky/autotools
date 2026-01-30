// src/models/order.model.js

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image_url: {
    type: String,
  },
  vehicle_make: String,
  vehicle_model: String,
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    order_number: {
      type: String,
      unique: true,
      index: true, // Single index declaration
    },
    // Customer Information
    customer: {
      email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
      },
    },
    // Shipping Information
    shipping: {
      full_name: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
      },
      address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      postal_code: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        default: "Nigeria",
        trim: true,
      },
    },
    // Order Items
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },
    // Payment Information
    payment: {
      method: {
        type: String,
        required: true,
        enum: ["paystack", "card", "bank_transfer", "cash_on_delivery", "wallet"],
        default: "cash_on_delivery",
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      transaction_id: String,
      paid_at: Date,
    },
    // Pricing - FIXED: Made optional with defaults
    subtotal: {
      type: Number,
      min: 0,
      default: 0,
    },
    shipping_fee: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      min: 0,
      default: 0,
    },
    // Order Status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    // Tracking
    tracking_number: String,
    delivery_notes: String,
    // Timestamps for status changes
    confirmed_at: Date,
    shipped_at: Date,
    delivered_at: Date,
    cancelled_at: Date,
    // Admin notes
    internal_notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes - FIXED: Removed duplicate order_number index
orderSchema.index({ "customer.email": 1 });
orderSchema.index({ "customer.phone": 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "payment.status": 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save hook to generate order number and calculate totals
orderSchema.pre("save", function () {
  // Generate order number if not exists
  if (!this.order_number) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.order_number = `ORD-${timestamp}-${random}`;
  }

  // Calculate totals from items
  if (this.items && this.items.length > 0) {
    // Calculate subtotal from items
    this.subtotal = this.items.reduce((sum, item) => {
      item.subtotal = item.price * item.quantity;
      return sum + item.subtotal;
    }, 0);

    // Calculate total
    this.total = this.subtotal + (this.shipping_fee || 0) + (this.tax || 0);
  }
});

// Virtual: Item Count
orderSchema.virtual("item_count").get(function () {
  return this.items ? this.items.length : 0;
});

// Virtual: Total Quantity
orderSchema.virtual("total_quantity").get(function () {
  return this.items
    ? this.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
});

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;

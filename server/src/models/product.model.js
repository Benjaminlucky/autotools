// src/models/product.model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: {
        values: [
          "Brakes",
          "Engine",
          "Suspension",
          "Electrical",
          "Body",
          "Other",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    sub_category: {
      type: String,
      trim: true,
      maxlength: [100, "Sub-category cannot exceed 100 characters"],
    },
    image_url: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    // Vendor Information (Admin Only)
    vendor_name: {
      type: String,
      trim: true,
      maxlength: [200, "Vendor name cannot exceed 200 characters"],
    },
    vendor_phone: {
      type: String,
      trim: true,
      match: [/^\+?[0-9]{10,15}$/, "Please provide a valid phone number"],
    },
    vendor_whatsapp: {
      type: String,
      trim: true,
      match: [/^\+?[0-9]{10,15}$/, "Please provide a valid WhatsApp number"],
    },
    cost_price: {
      type: Number,
      min: [0, "Cost price cannot be negative"],
    },
    // Additional useful fields
    stock_quantity: {
      type: Number,
      default: 0,
      min: [0, "Stock quantity cannot be negative"],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true, // Allows null values while maintaining uniqueness
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Index for faster searches
productSchema.index({ product_name: "text", description: "text" });
productSchema.index({ category: 1, sub_category: 1 });
productSchema.index({ price: 1 });

// Virtual field for profit margin
productSchema.virtual("profit_margin").get(function () {
  if (this.cost_price && this.price) {
    return this.price - this.cost_price;
  }
  return null;
});

// Virtual field for profit percentage
productSchema.virtual("profit_percentage").get(function () {
  if (this.cost_price && this.price && this.cost_price > 0) {
    return ((this.price - this.cost_price) / this.cost_price) * 100;
  }
  return null;
});

// Ensure virtuals are included when converting to JSON
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

const Product = mongoose.model("Product", productSchema);

export default Product;

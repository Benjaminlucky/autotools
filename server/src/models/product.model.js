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
          "Electronics",
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
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: {
        values: ["NEW", "USED"],
        message: "{VALUE} is not a valid condition",
      },
      default: "NEW",
    },
    vehicle_make: {
      type: String,
      trim: true,
      maxlength: [100, "Vehicle make cannot exceed 100 characters"],
    },
    vehicle_model: {
      type: String,
      trim: true,
      maxlength: [100, "Vehicle model cannot exceed 100 characters"],
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ["Draft", "Published"],
        message: "{VALUE} is not a valid status",
      },
      default: "Draft",
    },
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
    stock_quantity: {
      type: Number,
      default: 0,
      min: [0, "Stock quantity cannot be negative"],
    },
    low_stock_threshold: {
      type: Number,
      default: 5,
      min: [0, "Low stock threshold cannot be negative"],
    },
    track_inventory: {
      type: Boolean,
      default: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
productSchema.index({ product_name: "text", description: "text" });
productSchema.index({ category: 1, sub_category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ is_featured: 1, status: 1 });
productSchema.index({ vehicle_make: 1, vehicle_model: 1 });
productSchema.index({ stock_quantity: 1 });

// Virtual: In Stock Status
productSchema.virtual("in_stock").get(function () {
  return this.stock_quantity > 0;
});

// Virtual: Low Stock Status
productSchema.virtual("is_low_stock").get(function () {
  return (
    this.stock_quantity > 0 && this.stock_quantity <= this.low_stock_threshold
  );
});

// Virtual: Profit Margin
productSchema.virtual("profit_margin").get(function () {
  if (this.cost_price && this.price) {
    return this.price - this.cost_price;
  }
  return null;
});

// Virtual: Profit Percentage
productSchema.virtual("profit_percentage").get(function () {
  if (this.cost_price && this.price && this.cost_price > 0) {
    return ((this.price - this.cost_price) / this.cost_price) * 100;
  }
  return null;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

// Pre-save hook to auto-generate SKU
// FIXED: Removed next() parameter and call - not needed in modern Mongoose
productSchema.pre("save", function () {
  if (!this.sku) {
    this.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;

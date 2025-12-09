// src/controllers/product.controller.js

import Product from "../models/product.model.js";

// ============================================
// @desc Create a new product
// @route POST /api/products
// ============================================
export const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      price,
      category,
      sub_category,
      image_url,
      description,
      vendor_name,
      vendor_phone,
      vendor_whatsapp,
      cost_price,
      stock_quantity,
      sku,
    } = req.body;

    // Normalize numeric fields
    const normalizedData = {
      product_name,
      price: Number(price),
      category,
      sub_category,
      image_url,
      description,
      vendor_name,
      vendor_phone,
      vendor_whatsapp,
      cost_price: cost_price ? Number(cost_price) : undefined,
      stock_quantity: stock_quantity ? Number(stock_quantity) : 0,
      sku: sku || `SKU-${Date.now()}`,
    };

    const existingProduct = await Product.findOne({
      product_name: { $regex: new RegExp(`^${product_name}$`, "i") },
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "A product with this name already exists",
      });
    }

    const product = await Product.create(normalizedData);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating product",
    });
  }
};

// ============================================
// @desc Get ALL products
// @route GET /api/products
// ============================================
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Fetch products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

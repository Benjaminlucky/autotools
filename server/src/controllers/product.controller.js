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

      // NEW
      condition,
      vehicle_make,
      vehicle_model,
      is_featured,
      status,

      vendor_name,
      vendor_phone,
      vendor_whatsapp,
      cost_price,
      stock_quantity,
      sku,
    } = req.body;

    const product = await Product.create({
      product_name,
      price: Number(price),
      category,
      sub_category,
      image_url,
      description,

      // NEW
      condition: condition || "NEW",
      vehicle_make,
      vehicle_model,
      is_featured: Boolean(is_featured),
      status: status || "DRAFT",

      vendor_name,
      vendor_phone,
      vendor_whatsapp,
      cost_price: cost_price ? Number(cost_price) : undefined,
      stock_quantity: stock_quantity ? Number(stock_quantity) : 0,
      sku: sku || `SKU-${Date.now()}`,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        price: req.body.price ? Number(req.body.price) : undefined,
        cost_price: req.body.cost_price
          ? Number(req.body.cost_price)
          : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Draft", "Published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      message: `Product marked as ${status}`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// src/controllers/product.controller.js

import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      price,
      category,
      sub_category,
      image_url,
      description,
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
      low_stock_threshold,
      track_inventory,
      sku,
    } = req.body;

    const product = await Product.create({
      product_name,
      price: Number(price),
      category,
      sub_category,
      image_url,
      description,
      condition: condition || "NEW",
      vehicle_make,
      vehicle_model,
      is_featured: Boolean(is_featured),
      status: status || "Draft",
      vendor_name,
      vendor_phone,
      vendor_whatsapp,
      cost_price: cost_price ? Number(cost_price) : undefined,
      stock_quantity: stock_quantity ? Number(stock_quantity) : 0,
      low_stock_threshold: low_stock_threshold
        ? Number(low_stock_threshold)
        : 5,
      track_inventory:
        track_inventory !== undefined ? Boolean(track_inventory) : true,
      sku: sku || undefined,
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

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

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

export const updateProduct = async (req, res) => {
  try {
    if (req.body.status) {
      const statusMap = {
        DRAFT: "Draft",
        PUBLISHED: "Published",
        Draft: "Draft",
        Published: "Published",
      };
      req.body.status = statusMap[req.body.status];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        price: req.body.price ? Number(req.body.price) : undefined,
        cost_price: req.body.cost_price
          ? Number(req.body.cost_price)
          : undefined,
        stock_quantity:
          req.body.stock_quantity !== undefined
            ? Number(req.body.stock_quantity)
            : undefined,
        low_stock_threshold:
          req.body.low_stock_threshold !== undefined
            ? Number(req.body.low_stock_threshold)
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

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

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

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity, adjustment_type, adjustment_amount } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let newStock = product.stock_quantity;

    if (stock_quantity !== undefined) {
      newStock = Number(stock_quantity);
    } else if (adjustment_type && adjustment_amount) {
      const amount = Number(adjustment_amount);
      if (adjustment_type === "add") {
        newStock += amount;
      } else if (adjustment_type === "subtract") {
        newStock = Math.max(0, newStock - amount);
      }
    }

    product.stock_quantity = newStock;
    await product.save();

    res.json({
      success: true,
      message: "Stock updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      track_inventory: true,
      $expr: {
        $and: [
          { $gt: ["$stock_quantity", 0] },
          { $lte: ["$stock_quantity", "$low_stock_threshold"] },
        ],
      },
    }).sort({ stock_quantity: 1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOutOfStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      track_inventory: true,
      stock_quantity: 0,
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products,
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

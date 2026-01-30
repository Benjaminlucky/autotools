import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getLowStockProducts,
  getOutOfStockProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  updateStock,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/low-stock", getLowStockProducts);
router.get("/out-of-stock", getOutOfStockProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.patch("/:id/status", updateProductStatus);
router.patch("/:id/stock", updateStock);
router.delete("/:id", deleteProduct);

export default router;

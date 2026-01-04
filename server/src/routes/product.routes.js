import express from "express";
import {
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.patch("/:id/status", updateProductStatus);
router.delete("/:id", deleteProduct);

export default router;

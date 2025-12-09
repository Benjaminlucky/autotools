// src/routes/product.routes.js
import express from "express";
import {
  createProduct,
  getAllProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

// CREATE product
router.post("/", createProduct);

// GET all products
router.get("/", getAllProducts);

export default router;

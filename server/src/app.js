// src/app.js

import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js"; // NEW
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Auto Parts API is running" });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes); // NEW
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

export default app;

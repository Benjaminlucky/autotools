// src/app.js
import express from "express";
import cors from "cors";
import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

export default app;

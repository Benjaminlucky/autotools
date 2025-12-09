import express from "express";
import { adminLogin, adminSignup } from "../controllers/admin.controller.js";

const router = express.Router();

// Signup
router.post("/signup", adminSignup);

// Login
router.post("/login", adminLogin);

export default router;

import express from "express";
import authRoutes from "./userAuth.route";

const router = express.Router();

router.use("/", authRoutes);

export default router;

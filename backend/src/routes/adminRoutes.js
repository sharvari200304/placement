import express from "express";
import { dashboardStats, listUsers } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/stats", dashboardStats);
router.get("/users", listUsers);

export default router;

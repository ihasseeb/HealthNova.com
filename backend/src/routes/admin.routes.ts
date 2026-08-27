import { Router } from "express";

import {
  getPendingDoctors,
  verifyDoctor,
} from "../controllers/admin.controller";
import {
  getDashboardStats,
  getAllUsers,
  getRevenueAnalytics,
  getAppointmentAnalytics,
} from "../controllers/adminDashboard.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
// import { getSystemMetrics } from "../utils/systemMonitor";

const router = Router();
// GET System Health Metrics (Admin Only)
// router.get("/system-health", (req, res) => {
//   res.json({
//     success: true,
//     data: getSystemMetrics(),
//   });
// });

router.use(authenticate);
router.use(authorize("ADMIN"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Users
router.get("/users", getAllUsers);

// Doctor Verification
router.get("/doctors/pending", getPendingDoctors);
router.patch("/doctors/:doctorId/verify", verifyDoctor);

// Analytics
router.get("/analytics/revenue", getRevenueAnalytics);
router.get("/analytics/appointments", getAppointmentAnalytics);

export default router;

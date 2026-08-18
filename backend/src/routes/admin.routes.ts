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

const router = Router();

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

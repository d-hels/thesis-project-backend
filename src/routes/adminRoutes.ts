import express from "express";
const router = express.Router();

import { Roles } from "../lib/types";
import { auth } from "../middlewares/authentication";
import { adminGateGuard } from "../middlewares/adminGateGuard";

import {
  adminLogin,
  createAdmin,
  getUsers,
  updateUser,
  deleteUser,
  updateMyProfile,
  adminGate,
  getUsersCount,
  getActiveVerifiedNonAdminUsers,
  updateUserStatus,
  getWorkersCount,
  getUsersByDepartmentId,
  getUsersProfile,
  changePassword,
} from "../controllers/adminController";

/* =======================
   Auth & Gate
======================= */
router.post("/gate", adminGate);
router.post("/login", adminGateGuard, adminLogin);

/* =======================
   Protected (Admin / Manager)
======================= */
router.put("/users/me", auth([Roles.ADMIN, Roles.MANAGER]), updateMyProfile);

/* =======================
   Admin-only
======================= */
router.use(auth([Roles.ADMIN]));

/* Users */
router.get("/users", getUsers);
router.get("/users/count", getUsersCount);
router.get("/workers/count", getWorkersCount);
router.put("/users/update", updateUser);
router.put("/users/update/status/:id", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/departments/users/:id", getUsersByDepartmentId);
router.get("/users/profile/:id", getUsersProfile);
router.put("/change/password", changePassword);

/* Admins */
router.post("/create", createAdmin);

/* Dashboard */
router.get("/employees/recent", getActiveVerifiedNonAdminUsers);

export default router;

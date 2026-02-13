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
  getAllContracts,
  getAllUsers,
  getManagers,
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
router.get("/users/profile/:id", auth([Roles.ADMIN, Roles.MANAGER]), getUsersProfile);

/* =======================
   Admin-only
======================= */
router.use(auth([Roles.ADMIN]));

/* Users */
router.get("/users", getUsers);
router.get("/managers", getManagers);
router.get("/users/count", getUsersCount);
router.get("/workers/count", getWorkersCount);
router.put("/users/update", updateUser);
router.put("/users/update/status/:id", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/departments/users/:id", getUsersByDepartmentId);
router.put("/change/password", changePassword);
router.get("/users/all", getAllUsers);

/* Admins */
router.post("/create", createAdmin);

/* Dashboard */
router.get("/employees/recent", getActiveVerifiedNonAdminUsers);

/* Contrats */
router.get("/contracts", getAllContracts);

export default router;

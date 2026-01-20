import express from "express";
const router = express.Router();

import { Roles } from "../lib/types";
import { auth } from "../middlewares/authentication";

import {
  managerLogin,
  workerRegister,
  getWorkers,
  getWorkersCount,
  updateWorker,
  deleteWorker,
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  createPosition,
  getPositions,
  getPositionsByDepartmentId,
  updatePosition,
  deletePosition,
} from "../controllers/managerController";

/* =======================
   Auth
======================= */
router.post("/login", managerLogin);

router.use(auth([Roles.ADMIN, Roles.MANAGER]));

/* =======================
   Workers
======================= */
router.post("/workers", workerRegister);
router.get("/workers", getWorkers);
router.get("/workers/count", getWorkersCount);
router.put("/workers", updateWorker);
router.delete("/workers/:id", deleteWorker);

/* =======================
   Departments
======================= */
router.post("/departments", createDepartment);
router.get("/departments", getDepartments);
router.put("/departments", updateDepartment);
router.delete("/departments/:id", deleteDepartment);

/* =======================
   Positions
======================= */
router.post("/positions", createPosition);
router.get("/positions", getPositions);
router.get("/departments/:id/positions", getPositionsByDepartmentId);
router.put("/positions", updatePosition);
router.delete("/positions/:id", deletePosition);

export default router;

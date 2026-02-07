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
  checkInAttendance,
  checkOutAttendance,
  getAbsentWorkersCountByDepartment,
  getAttendanceWorkersByDepartment,
  getIfaUserCheckedIn,
  getDepartmentAttendanceStatsById,
  getDepartmentAttendanceByDateRange,
  getWorkersByDepartmentId,
  getContracts,
  createContract,
  updateContractStatus,
  sendContractPdfToUser,
  transferUserToDepartment,
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
router.get("/departments/workers/:id", getWorkersByDepartmentId);
router.put("/transfer", transferUserToDepartment);

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

/* =======================
   Attendance
======================= */

router.get("/attendance/:id", getAttendanceWorkersByDepartment);
router.post("/check-in", checkInAttendance);
router.post("/check-out", checkOutAttendance);
router.get("/absent/:id", getAbsentWorkersCountByDepartment);
router.get("/checked-in/:id", getIfaUserCheckedIn);
router.get("/stats/:id", getDepartmentAttendanceStatsById);
router.get("/department/:id/attendance", getDepartmentAttendanceByDateRange);

/* =======================
   contracts
======================= */
router.get("/contracts", getContracts);
router.get("/contracts/send-pdf/:id", sendContractPdfToUser);
router.post("/contracts", createContract);
router.put("/contracts", updateContractStatus);

export default router;

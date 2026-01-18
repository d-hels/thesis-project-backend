import express from "express";
const router = express.Router();
import { Roles } from "../lib/types";
import { auth } from "../middlewares/authentication";
import {
  createDepartment,
  createPosition,
  deleteDepartment,
  deletePosition,
  getDepartments,
  getPositionsByDepartmentId,
  getPositions,
  updateDepartment,
  updatePosition,
  workerRegister,
  getWorkersCount,
  getWorkers,
  deleteWorker,
  updateWorker,
  managerLogin,
} from "../controllers/managerController";

router.route("/login").post(managerLogin);
router.use(auth([Roles.ADMIN, Roles.MANAGER]));
router.route("/worker/create").post(workerRegister);
router.route("/createDepartment").post(createDepartment);
router.route("/getDepartments").get(getDepartments);
router.route("/departments/update").put(updateDepartment);
router.route("/delete/departments/:id").delete(deleteDepartment);
router.route("/getPositionsByDepartmentId/:id").get(getPositionsByDepartmentId);
router.route("/createPosition").post(createPosition);
router.route("/getPosition").get(getPositions);
router.route("/positions/update").put(updatePosition);
router.route("/delete/positions/:id").delete(deletePosition);
router.route("/getWorkersCount").get(getWorkersCount);
router.route("/getWorkers").get(getWorkers);
router.route("/workers/:id").delete(deleteWorker);
router.route("/workers/update").put(updateWorker);

export default router;

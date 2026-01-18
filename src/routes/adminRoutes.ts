import express from "express";
const router = express.Router();
import { Roles } from "../lib/types";
import { auth } from "../middlewares/authentication";
import {
  adminLogin,
  createAdmin,
  getUsers,
  updateUser,
  deleteUser,
  updateMyProfile,
  adminGate,
  getUsersCount,
} from "../controllers/adminController";
import { adminGateGuard } from "../middlewares/adminGateGuard";

router.route("/gate").post(adminGate);
router.route("/login").post(adminGateGuard, adminLogin);
router.use(auth([Roles.ADMIN]));
router.route("/getUsers").get(getUsers);
router.route("/admins/create").post(createAdmin);
router.route("/users/update").put(updateUser);
router.route("/users/myProfile/update").put(updateMyProfile);
router.route("/users/:id").delete(deleteUser);
router.route("/getUsersCount").get(getUsersCount);

export default router;

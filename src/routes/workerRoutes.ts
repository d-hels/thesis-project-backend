import express from 'express'
const router = express.Router()

import { Roles } from '../lib/types'
import { auth } from '../middlewares/authentication'
import {
  checkInAttendance,
  checkOutAttendance,
} from '../controllers/workerController'
import { getIfaUserCheckedIn } from '../controllers/managerController'

router.use(auth([Roles.WORKER]));
router.post("/check-in", checkInAttendance);
router.post("/check-out", checkOutAttendance);
router.get("/checked-in/:id", getIfaUserCheckedIn);

export default router

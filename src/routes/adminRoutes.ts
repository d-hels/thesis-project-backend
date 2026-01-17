import express from 'express'
const router = express.Router()
import { Roles } from '../lib/types'
import { auth } from '../middlewares/authentication'
import {
  adminLogin,
  createAdmin,
  getUsers,
  updateUser,
  deleteUser,
} from '../controllers/adminController'

router.route('/login').post(adminLogin)
router.use(auth([Roles.ADMIN]))
router.route('/getUsers').get(getUsers)
router.route('/admins/create').post(createAdmin)
router.route('/users/update').put(updateUser)
router.route('/users/:id').delete(deleteUser)

export default router;

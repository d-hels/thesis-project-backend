import express from 'express'
const router = express.Router()
import { Roles } from '../lib/types'
import { auth } from '../middlewares/authentication'
import {
  workerRegister,
} from '../controllers/workerController'


export default router

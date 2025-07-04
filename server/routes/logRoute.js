import express from 'express'
import auth from '../middleware/authMiddleware.js'
import {getLogs} from '../controllers/logController.js'

const router = express.Router()

router.get('/', auth, getLogs)

export default router
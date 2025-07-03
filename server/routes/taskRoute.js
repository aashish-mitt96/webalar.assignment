import express from 'express'

import {smartAssign} from '../controllers/assignController.js'
import {createTask, deleteTask, getTasks, updateTask} from '../controllers/taskController.js'
import {auth} from '../middleware/auth.js'

const router = express.Router()

router.get('/', getTasks)

router.post('/', auth, createTask)

router.put('/:id', auth, updateTask)
router.put('/smart-assign/:id', auth, smartAssign)

router.delete('/:id', auth, deleteTask)

export default router
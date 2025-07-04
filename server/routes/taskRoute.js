// server/routes/taskRoutes.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  smartAssign,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.post("/:taskId/smart-assign", auth, smartAssign);

export default router;

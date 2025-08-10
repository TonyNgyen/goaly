// src/routes/tasks.ts
import express from "express";
import {
  getAllTasks,
  createTask,
  getCompletedTasks,
  toggleTaskComplete,
  getTasksForToday,
  getOverdueTasks,
  getTasksCompletedToday,
} from "../controllers/tasks";

const router = express.Router();

router.get("/", getAllTasks);
router.post("/", createTask);
router.get("/completed", getCompletedTasks);
router.get("/today", getTasksForToday);
router.get("/overdue", getOverdueTasks);
router.get("/completedToday", getTasksCompletedToday);
router.patch("/:id/toggleComplete", toggleTaskComplete);

export default router;

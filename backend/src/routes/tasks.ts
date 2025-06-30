// src/routes/tasks.ts
import express from "express";
import {
  getAllTasks,
  createTask,
  getCompletedTasks,
  completeTask,
  toggleTaskComplete,
  getTasksForToday,
  getOverdueTasks,
  getTasksCompletedToday, // 👈 Add this
} from "../controllers/tasks";

const router = express.Router();

router.get("/getAllTasks", getAllTasks);
router.post("/createTask", createTask);
router.get("/completed", getCompletedTasks);
router.get("/today", getTasksForToday);
router.get("/overdue", getOverdueTasks);
router.get("/completedToday", getTasksCompletedToday);
router.patch("/:id/complete", completeTask);
router.patch("/:id/toggleComplete", toggleTaskComplete);

export default router;

import { Router } from "express";
import {
  createGoal,
  getAllGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
} from "../controllers/goals";

const router = Router();

router.post("/", createGoal);
router.get("/", getAllGoals);
router.get("/:id", getGoalById);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;

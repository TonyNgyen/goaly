// src/controllers/goals.ts
import { Request, Response } from "express";
import { prisma } from "../prisma";

// Utility: calculate progress for a goal
function calculateProgress(tasks: { completed: boolean }[]) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionPercentage =
    totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  return {
    totalTasks,
    completedTasks,
    completionPercentage: Math.round(completionPercentage),
  };
}

// Create a new goal
export const createGoal = async (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "Title is required and must be a string." });
    return;
  }

  try {
    const goal = await prisma.goal.create({
      data: { title, description },
      select: { id: true, title: true, description: true, createdAt: true },
    });
    res.status(201).json(goal);
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ error: "Failed to create goal" });
  }
};

// Get all goals with progress
export const getAllGoals = async (req: Request, res: Response) => {
  try {
    const goals = await prisma.goal.findMany({
      include: { tasks: { select: { completed: true } } },
    });

    const result = goals.map((goal) => ({
      ...goal,
      ...calculateProgress(goal.tasks),
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

// Get single goal by ID with progress
export const getGoalById = async (req: Request, res: Response) => {
  const goalId = parseInt(req.params.id, 10);

  if (isNaN(goalId)) {
    res.status(400).json({ error: "Invalid goal ID" });
    return;
  }

  try {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: { tasks: { select: { completed: true } } },
    });

    if (!goal) {
      res.status(404).json({ error: "Goal not found" });
      return;
    }

    res.json({
      ...goal,
      ...calculateProgress(goal.tasks),
    });
  } catch (error) {
    console.error("Error fetching goal:", error);
    res.status(500).json({ error: "Failed to fetch goal" });
  }
};

// Update a goal
export const updateGoal = async (req: Request, res: Response) => {
  const goalId = parseInt(req.params.id, 10);
  const { title, description } = req.body;

  if (isNaN(goalId)) {
    res.status(400).json({ error: "Invalid goal ID" });
    return;
  }

  try {
    const updated = await prisma.goal.update({
      where: { id: goalId },
      data: { title, description },
      select: { id: true, title: true, description: true},
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ error: "Failed to update goal" });
  }
};

// Delete a goal
export const deleteGoal = async (req: Request, res: Response) => {
  const goalId = parseInt(req.params.id, 10);

  if (isNaN(goalId)) {
    res.status(400).json({ error: "Invalid goal ID" });
    return;
  }

  try {
    await prisma.goal.delete({ where: { id: goalId } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ error: "Failed to delete goal" });
  }
};

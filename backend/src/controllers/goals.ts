import { Request, Response } from "express";
import { prisma } from "../prisma";

// Create a new goal
export const createGoal = async (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title || typeof title !== "string") {
    return res
      .status(400)
      .json({ error: "Title is required and must be a string." });
  }

  try {
    const goal = await prisma.goal.create({
      data: { title, description },
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
      include: {
        tasks: { select: { id: true, completed: true } },
      },
    });

    const goalsWithProgress = goals.map((goal) => {
      const totalTasks = goal.tasks.length;
      const completedTasks = goal.tasks.filter((t) => t.completed).length;
      const completionPercentage =
        totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

      return {
        ...goal,
        completionPercentage: Math.round(completionPercentage),
        completedTasks,
        totalTasks,
      };
    });

    res.json(goalsWithProgress);
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

// Get single goal by ID with progress
export const getGoalById = async (req: Request, res: Response) => {
  const goalId = parseInt(req.params.id, 10);

  if (isNaN(goalId)) {
    return res.status(400).json({ error: "Invalid goal ID" });
  }

  try {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: {
        _count: { select: { tasks: true } },
        tasks: { where: { completed: true }, select: { id: true } },
      },
    });

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const totalTasks = goal._count.tasks;
    const completedTasks = goal.tasks.length;
    const completionPercentage =
      totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    res.json({
      ...goal,
      completionPercentage: Math.round(completionPercentage),
      completedTasks,
      totalTasks,
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
    return res.status(400).json({ error: "Invalid goal ID" });
  }

  try {
    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: { title, description },
    });

    res.json(goal);
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ error: "Failed to update goal" });
  }
};

// Delete a goal
export const deleteGoal = async (req: Request, res: Response) => {
  const goalId = parseInt(req.params.id, 10);

  if (isNaN(goalId)) {
    return res.status(400).json({ error: "Invalid goal ID" });
  }

  try {
    await prisma.goal.delete({ where: { id: goalId } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ error: "Failed to delete goal" });
  }
};

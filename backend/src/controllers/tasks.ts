// src/controllers/tasks.ts
import { Request, Response } from "express";
import { prisma } from "../prisma";

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Failed to load tasks" });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("🔍 Incoming request for task ID:", id);

  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error("Error fetching task by ID:", err);
    res.status(500).json({ error: "Failed to fetch task" });
  }
};

export const getTasksForToday = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    const tasks = await prisma.task.findMany({
      where: {
        dueDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });
    res.json(tasks);
  } catch (err) {
    console.error("Failed to get today's tasks:", err);
    res.status(500).json({ error: "Failed to get today's tasks" });
  }
};

export const getOverdueTasks = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const tasks = await prisma.task.findMany({
      where: {
        dueDate: {
          lt: startOfDay,
        },
        completed: false,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    res.json(tasks);
  } catch (err) {
    console.error("Failed to get today's tasks:", err);
    res.status(500).json({ error: "Failed to get today's tasks" });
  }
};

export const getTasksCompletedToday = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    const tasks = await prisma.task.findMany({
      where: {
        completedAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
        completed: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    res.json(tasks);
  } catch (err) {
    console.error("Failed to get today's tasks:", err);
    res.status(500).json({ error: "Failed to get today's tasks" });
  }
};

export const getCompletedTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { completed: true },
      orderBy: { completedAt: "desc" },
    });
    res.json(tasks);
  } catch (err) {
    console.error("Failed to get completed tasks:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, description, dueDate } = req.body;

  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "Title is required and must be a string." });
    return;
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const completeTask = async (req: Request, res: Response) => {
  console.log("Calling");
  const { id } = req.params;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Failed to mark task complete:", error);
    res.status(500).json({ error: "Failed to mark task complete" });
  }
};

export const toggleTaskComplete = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!task) {
      res.status(404).json({
        error: "Failed to toggle task completion: Task was not found.",
      });
      return;
    }

    const now = new Date();

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        completed: !task.completed,
        completedAt: !task.completed ? now : null,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Failed to toggle task completion:", error);
    res.status(500).json({ error: "Failed to toggle task completion" });
  }
};

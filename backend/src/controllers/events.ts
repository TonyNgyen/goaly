import { Request, Response } from "express";
import { prisma } from "../prisma";

// Work

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Failed to load tasks" });
  }
};
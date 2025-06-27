// src/controllers/tasks.ts

import { Request, Response } from "express";

export const getAllTasks = (req: Request, res: Response) => {
  const tasks = [
    {
      id: 1,
      title: "Plan weekly goals",
      description: "List out top 3 goals for the week",
      completed: false,
      dueDate: "2025-06-25",
    },
    {
      id: 2,
      title: "Fix task card UI",
      description: "Polish spacing and hover effect",
      completed: true,
      dueDate: "2025-06-24",
    },
  ];

  res.json({ tasks });
};

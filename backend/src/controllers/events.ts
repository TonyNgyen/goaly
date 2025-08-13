import { Request, Response } from "express";
import { prisma } from "../prisma";

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findMany();
    res.json(event);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Failed to load events" });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  const { title, date, description, start, end } = req.body;

  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        date,
        description,
        start,
        end,
      },
    });
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Failed to create event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
};

export const getEventsWithDate = async (req: Request, res: Response) => {
  const { date } = req.params;

  try {
    const events = await prisma.event.findMany({
      where: {
        date: date,
      },
    });
    res.json(events);
  } catch (err) {
    console.error("Failed to get events for date:", err);
    res.status(500).json({ error: "Failed to get events for date" });
  }
}
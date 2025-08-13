import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventsWithDate,
  test,
} from "../controllers/events";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:date", getEventsWithDate);
router.get("/test", test);
router.post("/", createEvent);

export default router;

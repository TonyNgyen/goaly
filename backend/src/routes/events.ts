import express from "express";
import {
    createEvent,
    getAllEvents
} from "../controllers/events";

const router = express.Router();

router.get("/", getAllEvents);
router.post("/", createEvent);

export default router;
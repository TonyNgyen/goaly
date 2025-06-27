// src/routes/tasks.ts

import express from "express";
import { getAllTasks } from "../controllers/tasks";

const router = express.Router();

router.get("/getAllTasks", getAllTasks);

export default router;

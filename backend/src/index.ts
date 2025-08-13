import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/tasks";
import eventRoutes from "./routes/events";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/api/tasks", taskRoutes);
console.log("✅ /api/tasks mounted");

app.use("/api/events", eventRoutes);
console.log("✅ /api/events mounted");

app.get("/test", (req, res) => {
  console.log("🧪 Test endpoint hit");
  res.json({ message: "✅ Express is working" });
});

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

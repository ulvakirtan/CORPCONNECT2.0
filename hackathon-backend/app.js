import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import protect from "./middleware/authMiddleware.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});
app.get("/", (req, res) => {
  res.json({ message: "API Running Successfully " });
});

export default app;
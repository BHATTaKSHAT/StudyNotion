import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config({
  path: "./.env",
});

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/logos", express.static("logos"));
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));

db()
  .then(() => {
    app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
      console.log(`⚙️ Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  });

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import commentRoute from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

console.log("🔵 Loading middleware...");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ✅ Updated CORS: Allow local + Netlify frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local development
      "https://creative-liger-2888e0.netlify.app" // ✅ Netlify frontend
    ],
    credentials: true,
  })
);

console.log("🔵 Connecting to MongoDB...");
connectDB();

// ✅ API Routes only (no static frontend serving)
console.log("🟢 Mounting user routes...");
app.use("/api/v1/user", userRoute);

console.log("🟢 Mounting blog routes...");
app.use("/api/v1/blog", blogRoute);

console.log("🟢 Mounting comment routes...");
app.use("/api/v1/comment", commentRoute);

// ❌ Removed frontend build serving
// ✅ This backend only handles API calls

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

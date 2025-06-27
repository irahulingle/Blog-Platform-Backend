import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import commentRoute from "./routes/comment.route.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';




const app = express();
const PORT = process.env.PORT || 3000;

console.log("🔵 Loading middleware...");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const __dirname = path.resolve(); // ✅ correct usage

console.log("🔵 Connecting to MongoDB...");

// API Routes
console.log("🟢 Mounting user routes...");
app.use("/api/v1/user", userRoute);
console.log("🟢 Mounting blog routes...");
app.use("/api/v1/blog", blogRoute);
console.log("🟢 Mounting comment routes...");
app.use("/api/v1/comment", commentRoute);

// Frontend build
console.log("🟢 Serving frontend...");
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("/*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});
connectDB();
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    
});

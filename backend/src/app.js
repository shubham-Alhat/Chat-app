import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();

const __dirname = path.resolve();

app.use(express.json({ limit: "16kb" })); // allow express to take json data
app.use(cookieParser()); // allow us to set and get user browser cookies
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Allow express to encode the url. eg " " = %20 or +. @ = %40

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// import routes
import authRoutes from "../routes/auth.route.js";
import messageRoutes from "../routes/message.route.js";

// routes declaration
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

export { app };

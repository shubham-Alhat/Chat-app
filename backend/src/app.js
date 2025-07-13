import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "16kb" })); // allow express to take json data
app.use(cookieParser()); // allow us to set and get user browser cookies
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Allow express to encode the url. eg " " = %20 or +. @ = %40

// import routes
import authRoutes from "../routes/auth.route.js";
import messageRoutes from "../routes/message.route.js";

// routes declaration
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/message", messageRoutes);

export { app };

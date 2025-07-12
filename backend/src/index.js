import express from "express";
import authRoutes from "../routes/auth.route.js";
import dotenv from "dotenv";
import connectToDb from "../db/connection.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();

const PORT = process.env.PORT;

// routes
app.use("/api/v1/auth", authRoutes);
app.use(express.json({ limit: "16kb" })); // allow express to take json data
app.use(cookieParser()); // allow us to set and get user browser cookies
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Allow express to encode the url. eg " " = %20 or +. @ = %40

connectToDb()
  .then(() => {
    app.listen(PORT || 8000, () => {
      console.log(`🖥 Server running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("database connection failed :", err);
  });

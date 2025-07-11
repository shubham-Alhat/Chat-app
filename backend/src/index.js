import express from "express";
import authRoutes from "../routes/auth.route.js";
import dotenv from "dotenv";
import connectToDb from "../db/connection.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT;

// routes
app.use("/api/v1/auth", authRoutes);

connectToDb()
  .then(() => {
    app.listen(PORT || 8000, () => {
      console.log(`🖥 Server running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("database connection failed :", err);
  });

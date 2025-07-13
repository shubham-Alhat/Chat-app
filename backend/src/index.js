import dotenv from "dotenv";
import connectToDb from "../db/connection.js";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT;

connectToDb()
  .then(() => {
    app.listen(PORT || 8000, () => {
      console.log(`🖥 Server running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("database connection failed :", err);
  });

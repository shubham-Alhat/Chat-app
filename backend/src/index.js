import dotenv from "dotenv";
import connectToDb from "../db/connection.js";
import { app } from "./app.js";
import { server } from "./socket.js";

dotenv.config();

const PORT = process.env.PORT;

connectToDb()
  .then(() => {
    server.listen(PORT || 8000, () => {
      console.log(`🖥 Server running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("database connection failed :", err);
  });

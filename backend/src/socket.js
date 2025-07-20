import http from "http";
import { app } from "./app.js";
import { Server } from "socket.io";

export const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  console.log(`🟢 New User connected ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔴 A User is disconnected ${socket.id}`);
  });
});

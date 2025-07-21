import http from "http";
import { app } from "./app.js";
import { Server } from "socket.io";
import { addUser, getOnlineUsers, removeUser } from "../lib/onlineUsers.js";

export const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  console.log(`🟢 New User connected ${socket.id}`);

  // add user when connect on frontend
  socket.on("user-connected", (userId) => {
    addUser(userId, socket.id);
    // send onlineUsers when connected
    io.emit("online-users", getOnlineUsers());
  });

  socket.on("disconnect", () => {
    console.log(`🔴 A User is disconnected ${socket.id}`);
    removeUser(socket.id);
    io.emit("online-users", getOnlineUsers());
  });
});

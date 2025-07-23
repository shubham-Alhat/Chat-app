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
    // socket.join(userId);
    // send onlineUsers when connected
    io.emit("online-users", getOnlineUsers());
  });

  // join room when this event emit
  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
    console.log("chat id", chatId);
  });

  // recieve and send messages
  socket.on("send-message", ({ chatId, message }) => {
    // send to receiver room directly
    // io.to(recieverId).emit("recieve-message", message);
    console.log("chatId when send message", chatId);
    socket.to(chatId).emit("recieve-message", message);
  });

  socket.on("leave-all-chats", () => {
    // Leave all rooms except the default room (socket.id)
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.leave(room);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 A User is disconnected ${socket.id}`);
    removeUser(socket.id);
    io.emit("online-users", getOnlineUsers());
  });
});

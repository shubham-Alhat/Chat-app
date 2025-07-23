import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

const socket = io(BASE_URL, {
  autoConnect: false,
});

export default socket;

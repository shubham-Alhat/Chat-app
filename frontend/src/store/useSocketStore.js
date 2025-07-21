import { create } from "zustand";

const useSocketStore = create((set) => ({
  socketState: null,
  setSocketState: (socket) => {
    set({ socketState: socket });
  },
  onlineUsers: [],
  setOnlineUsers: (onlineUsers) => {
    set({ onlineUsers: onlineUsers });
  },
}));

export default useSocketStore;

import { create } from "zustand";

const useChatStore = create((set) => ({
  usersForChat: [],
  selectedUser: null,
  messages: [],
  setMessages: (messages) => {
    set({ messages: messages });
  },
  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
  setUsersForChat: (users) => {
    set({ usersForChat: users });
  },
}));

export default useChatStore;

import { create } from "zustand";

const useChatStore = create((set, get) => ({
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
  addNewMessage: (newMessage) => {
    set({ messages: [...get().messages, newMessage.message] });
  },
  deleteMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.filter((m) => m._id !== messageId),
    }));
  },
}));

export default useChatStore;

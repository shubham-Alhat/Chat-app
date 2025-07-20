import { create } from "zustand";

const useAuthStore = create((set) => ({
  authUser: null,
  setAuthUser: (user) => {
    set({ authUser: user });
  },
}));

export default useAuthStore;

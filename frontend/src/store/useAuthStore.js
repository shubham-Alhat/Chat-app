import { create } from "zustand";

const useAuthStore = create((set) => ({
  authUser: null,
  isChecking: true,
}));

export default useAuthStore;

import { create } from "zustand";

type UsersStore = {
  onlineUsers: string[];
  setOnlineUsers: (users: string[]) => void;
};

export const useUsersStore = create<UsersStore>((set) => ({
  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUser = create(
  persist(
    (set) => ({
      user: { name: "incognito" },
      setUser: (newOne) => set(() => ({ user: newOne })),
      clearUser: () => set(() => ({ user: { name: "incognito" } })),
      weekly: undefined,
      changeWeekly: (data) => set(() => ({ weekly: data })),
    }),
    { name: "user storage", skipHydration: true }
  )
);

export default useUser;

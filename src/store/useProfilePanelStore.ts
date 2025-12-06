// src/store/useProfilePanelStore.ts
"use client";

import { create } from "zustand";

type ProfilePanelState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useProfilePanelStore = create<ProfilePanelState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

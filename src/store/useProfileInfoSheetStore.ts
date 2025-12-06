// src/store/useProfileInfoSheetStore.ts
"use client";

import { create } from "zustand";

export type ProfileInfoType = "rules" | "support" | "about";

type ProfileInfoSheetState = {
  isOpen: boolean;
  type: ProfileInfoType | null;
  open: (type: ProfileInfoType) => void;
  close: () => void;
};

export const useProfileInfoSheetStore = create<ProfileInfoSheetState>((set) => ({
  isOpen: false,
  type: null,
  open: (type) => set({ isOpen: true, type }),
  close: () => set({ isOpen: false, type: null }),
}));

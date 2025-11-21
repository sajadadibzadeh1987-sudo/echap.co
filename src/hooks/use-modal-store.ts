import { create } from "zustand"

type ModalType = "auth" | "editProfile" | "selectRole" | null

interface ModalStore {
  type: ModalType
  isOpen: boolean
  openModal: (type: ModalType) => void
  closeModal: () => void
}

const useModalStore = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  openModal: (type: ModalType) => set({ isOpen: true, type }),
  closeModal: () => set({ isOpen: false, type: null }),
}))

export default useModalStore

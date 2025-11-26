import { create } from "zustand"

type IheaderStore = {
  title: string
  setTitle: (newTitle: string) => void
}

export const useHeaderStore = create<IheaderStore>((set) => ({
  title: '',
  setTitle: (newTitle: string) => set(() => ({ title: newTitle })),
}))
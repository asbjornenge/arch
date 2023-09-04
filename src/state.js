import { create } from 'zustand'

export const fileState = create((set) => ({
  file: null,
  setFile: (file) => set((state) => ({ file: file }))
}))

export const controlState = create((set) => ({
  adding: false,
  toggleAddingEdge: () => set((state) => ({ adding: !state.adding })),
  setAddingEdge: (val) => set((state) => ({ adding: val }))
}))

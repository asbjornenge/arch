import { create } from 'zustand'

export const MAX_HISTORY_SHAPSHOTS = 30

export const fileState = create((set) => ({
  file: null,
  setFile: (file) => set((state) => ({ file: file }))
}))

export const controlState = create((set) => ({
  adding: false,
  toggleAddingEdge: () => set((state) => ({ adding: !state.adding })),
  setAddingEdge: (val) => set((state) => ({ adding: val }))
}))

export const historyState = create((set) => ({
  history: [],
  addSnapshot: (snapshot, slashIndex) => set((state) => { 
    let history = state.history
    if (slashIndex !== -1) {
      history = state.history.slice(0,slashIndex+1)
    }
    history = history.concat(snapshot)
    if (history.length > MAX_HISTORY_SHAPSHOTS) {
      history = history.slice(1, MAX_HISTORY_SHAPSHOTS+1)
    }
    //console.log(history.map(h => h.hash))
    const h = {
      history: history 
    } 
    return h
  })
}))


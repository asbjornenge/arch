import { create } from 'zustand'

export const TOP_HEIGHT = 45
export const ONCHANGE_TIMEOUT = 500
export const MAX_HISTORY_SHAPSHOTS = 30
export const WORKSPACE_HEIGHT_MARGIN = 2

export const fileState = create((set) => ({
  file: null,
  setFile: (file) => set((state) => ({ file: file }))
}))

export const codeState = create((set, get) => ({
  code: '',
  file: null,
  changed: false,
  language: '',
  getCode: () => get().code,
  setCode: (code) => set((state) => ({ ...state, code: code})),
  setCodeChanged: (changed) => set((state) => ({ ...state, changed: changed })),
  resetCodeState: () => set((state) => ({ code: '', file: null, language: '' })),
  setCodeFile: async (file) => {
    const code = await window.electron.readFile(file)
    const language = await window.electron.fileType(file)
    set((state) => ({ ...state, file: file, code: code, language: language }))
  },
}))

export const controlState = create((set) => ({
  adding: false,
  toggleAddingEdge: () => set((state) => ({ adding: !state.adding })),
  setAddingEdge: (val) => set((state) => ({ adding: val }))
}))

export const historyState = create((set) => ({
  history: [],
  clearHistory: () => set((state) => ({ history: [] })),
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


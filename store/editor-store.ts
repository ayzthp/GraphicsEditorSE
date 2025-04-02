import { create } from "zustand"
import type { Canvas, Object as FabricObject } from "fabric"

interface EditorState {
  canvas: Canvas | null
  selectedObject: FabricObject | null
  history: string[]
  future: string[]
  setCanvas: (canvas: Canvas) => void
  setSelectedObject: (object: FabricObject | null) => void
  saveState: () => void
  undo: () => void
  redo: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  canvas: null,
  selectedObject: null,
  history: [],
  future: [],

  setCanvas: (canvas) => set({ canvas }),

  setSelectedObject: (object) => set({ selectedObject: object }),

  saveState: () => {
    const { canvas, history } = get()
    if (!canvas) return

    const json = JSON.stringify(canvas.toJSON())
    set({
      history: [...history, json],
      future: [], // Clear redo stack when a new action is performed
    })
  },

  undo: () => {
    const { canvas, history, future } = get()
    if (!canvas || history.length === 0) return

    // Save current state to future for redo
    const currentState = JSON.stringify(canvas.toJSON())
    const newFuture = [currentState, ...future]

    // Get last history state
    const newHistory = [...history]
    const lastState = newHistory.pop()

    if (lastState) {
      canvas.loadFromJSON(JSON.parse(lastState), canvas.renderAll.bind(canvas))
      set({
        history: newHistory,
        future: newFuture,
      })
    }
  },

  redo: () => {
    const { canvas, history, future } = get()
    if (!canvas || future.length === 0) return

    // Get next future state
    const newFuture = [...future]
    const nextState = newFuture.shift()

    // Save current state to history
    const currentState = JSON.stringify(canvas.toJSON())
    const newHistory = [...history, currentState]

    if (nextState) {
      canvas.loadFromJSON(JSON.parse(nextState), canvas.renderAll.bind(canvas))
      set({
        history: newHistory,
        future: newFuture,
      })
    }
  },
}))


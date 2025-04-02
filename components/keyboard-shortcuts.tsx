"use client"

import { useEffect } from "react"
import { useEditorStore } from "@/store/editor-store"
import { util } from "fabric"
import { Canvas, Object as FabricObject } from "fabric"

export default function KeyboardShortcuts() {
  const { canvas, selectedObject, undo, redo, saveState } = useEditorStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input field
      if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement) {
        return
      }

      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault()
        undo()
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.ctrlKey && e.key === "y") || (e.ctrlKey && e.shiftKey && e.key === "z")) {
        e.preventDefault()
        redo()
      }

      // Delete: Delete or Backspace
      if ((e.key === "Delete" || e.key === "Backspace") && selectedObject && canvas) {
        e.preventDefault()
        canvas.remove(selectedObject)
        saveState()
      }

      // Group: Ctrl+G
      if (e.ctrlKey && e.key === "g" && !e.shiftKey && canvas) {
        e.preventDefault()
        const activeSelection = canvas.getActiveObject()
        if (activeSelection && activeSelection.type === 'activeSelection') {
          activeSelection.toGroup()
          canvas.requestRenderAll()
          saveState()
        }
      }

      // Ungroup: Ctrl+Shift+G
      if (e.ctrlKey && e.shiftKey && e.key === "g" && canvas) {
        e.preventDefault()
        const activeObject = canvas.getActiveObject()
        if (activeObject && activeObject.type === 'group') {
          activeObject.toActiveSelection()
          canvas.requestRenderAll()
          saveState()
        }
      }

      // Copy: Ctrl+C
      if (e.ctrlKey && e.key === "c" && selectedObject && canvas) {
        e.preventDefault()
        try {
          const activeObject = canvas.getActiveObject();
          if (!activeObject) return;
          activeObject.clone(function(cloned: FabricObject) {
            if (!cloned) return
            const safeObj = cloned.toObject(['left', 'top', 'width', 'height', 'fill', 'stroke', 'strokeWidth', 'opacity', 'type'])
            localStorage.setItem("graphics-editor-clipboard", JSON.stringify(safeObj))
          })
        } catch (error) {
          console.error('Failed to copy object:', error)
        }
      }

      // Paste: Ctrl+V
      if (e.ctrlKey && e.key === "v" && canvas) {
        e.preventDefault()
        try {
          const clipboardData = localStorage.getItem("graphics-editor-clipboard")
          if (clipboardData) {
            const parsedData = JSON.parse(clipboardData)
            util.enlivenObjects([parsedData], {
              callback: (objects: FabricObject[]) => {
                objects.forEach((o) => {
                  if (!o) return
                  o.set({
                    left: (o.left || 0) + 20,
                    top: (o.top || 0) + 20,
                  })
                  canvas.add(o)
                  canvas.setActiveObject(o)
                })
                canvas.requestRenderAll()
                saveState()
              }
            })
          }
        } catch (error) {
          console.error('Failed to paste object:', error)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [canvas, selectedObject, undo, redo, saveState])

  return null
}


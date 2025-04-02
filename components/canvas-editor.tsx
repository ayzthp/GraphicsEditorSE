"use client"

import { useEffect, useRef } from "react"
import { Canvas } from "fabric"
import { useEditorStore } from "@/store/editor-store"

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<Canvas | null>(null)
  const { setCanvas, setSelectedObject, saveState } = useEditorStore()

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Fabric.js canvas
    const canvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
      selection: true,
    })

    fabricCanvasRef.current = canvas
    setCanvas(canvas)

    // Add initial state to history
    saveState()

    // Set up event listeners
    canvas.on("selection:created", (e) => {
      setSelectedObject(e.selected?.[0] || null)
    })

    canvas.on("selection:updated", (e) => {
      setSelectedObject(e.selected?.[0] || null)
    })

    canvas.on("selection:cleared", () => {
      setSelectedObject(null)
    })

    canvas.on("object:modified", () => {
      saveState()
    })

    canvas.on("object:added", () => {
      saveState()
    })

    canvas.on("object:removed", () => {
      saveState()
    })

    // Clean up
    return () => {
      canvas.dispose()
    }
  }, [setCanvas, setSelectedObject, saveState])

  return (
    <div className="border border-gray-300 shadow-lg overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  )
}


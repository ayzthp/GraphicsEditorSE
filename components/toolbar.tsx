"use client"

import type React from "react"
import { useState } from "react"
import { useEditorStore } from "@/store/editor-store"
import { Rect, Circle, IText, Line, Image as FabricImage, Polygon } from "fabric"
import {
  Square,
  CircleIcon,
  Type,
  Minus,
  Triangle,
  Trash2,
  Copy,
  Undo,
  Redo,
  Save,
  FolderOpen,
  Image,
  Download,
  Group,
  Ungroup,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Object as FabricObject } from "fabric"
import { useRef } from "react"

export default function Toolbar() {
  const { canvas, selectedObject, saveState, undo, redo } = useEditorStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const addRectangle = () => {
    if (!canvas) return

    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: "#4299e1",
      stroke: "#2b6cb0",
      strokeWidth: 2,
    })

    canvas.add(rect)
    canvas.setActiveObject(rect)
    saveState()
  }

  const addCircle = () => {
    if (!canvas) return

    const circle = new Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: "#ed8936",
      stroke: "#c05621",
      strokeWidth: 2,
    })

    canvas.add(circle)
    canvas.setActiveObject(circle)
    saveState()
  }

  const addText = () => {
    if (!canvas) return

    const text = new IText("Edit this text", {
      left: 100,
      top: 100,
      fontFamily: "Arial",
      fontSize: 24,
      fill: "#2d3748",
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    saveState()
  }

  const addLine = () => {
    if (!canvas) return

    const line = new Line([50, 100, 200, 100], {
      stroke: "#2d3748",
      strokeWidth: 4,
    })

    canvas.add(line)
    canvas.setActiveObject(line)
    saveState()
  }

  const addTriangle = () => {
    if (!canvas) return

    const triangle = new Polygon([
      { x: 100, y: 50 },
      { x: 50, y: 150 },
      { x: 150, y: 150 }
    ], {
      left: 100,
      top: 100,
      fill: "#9f7aea",
      stroke: "#805ad5",
      strokeWidth: 2,
    })

    canvas.add(triangle)
    canvas.setActiveObject(triangle)
    saveState()
  }

  const deleteObject = () => {
    if (!canvas || !selectedObject) return

    canvas.remove(selectedObject)
    saveState()
  }

  const duplicateObject = () => {
    if (!canvas || !selectedObject) return

    try {
      selectedObject.clone((cloned: FabricObject) => {
        if (!cloned) return
        cloned.set({
          left: (selectedObject.left || 0) + 20,
          top: (selectedObject.top || 0) + 20,
        })
        canvas.add(cloned)
        canvas.setActiveObject(cloned)
        canvas.requestRenderAll()
        saveState()
      }, ['left', 'top', 'width', 'height', 'fill', 'stroke', 'strokeWidth', 'opacity', 'type'])
    } catch (error) {
      console.error('Failed to duplicate object:', error)
    }
  }

  const groupObjects = () => {
    if (!canvas) return
    const activeSelection = canvas.getActiveObject()
    if (!activeSelection || !activeSelection.type === 'activeSelection') return

    activeSelection.toGroup()
    canvas.requestRenderAll()
    saveState()
  }

  const ungroupObjects = () => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject || activeObject.type !== 'group') return

    activeObject.toActiveSelection()
    canvas.requestRenderAll()
    saveState()
  }

  const saveCanvasAsJSON = async () => {
    if (!canvas) return

    const json = JSON.stringify(canvas.toJSON())
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "graphics-editor-canvas.json"
    link.click()

    URL.revokeObjectURL(url)
  }

  const saveCanvasAsPNG = () => {
    if (!canvas) return

    // Convert canvas to data URL and trigger download
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1.0,
      multiplier: 1,
      enableRetinaScaling: false
    })

    const link = document.createElement("a")
    link.href = dataURL
    link.download = "graphics-editor-canvas.png"
    link.click()
  }

  const loadCanvasFromJSON = () => {
    if (!canvas) return

    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleJSONFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return

    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const json = event.target?.result as string
      canvas.loadFromJSON(JSON.parse(json), () => {
        canvas.renderAll()
        saveState()
      })
    }
    reader.readAsText(file)

    // Reset the input value so the same file can be loaded again
    if (e.target) {
      e.target.value = ""
    }
  }

  const loadImage = () => {
    if (!canvas) return

    if (imageInputRef.current) {
      imageInputRef.current.click()
    }
  }

  const handleImageLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return

    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imgObj = new window.Image()
      imgObj.src = event.target?.result as string
      imgObj.onload = () => {
        const fabricImg = new FabricImage(imgObj)

        // Scale down large images to fit the canvas
        if (fabricImg.width && fabricImg.width > canvas.width) {
          const scaleFactor = canvas.width / (fabricImg.width * 1.2)
          fabricImg.scale(scaleFactor)
        }

        canvas.add(fabricImg)
        canvas.setActiveObject(fabricImg)
        canvas.renderAll()
        saveState()
      }
    }
    reader.readAsDataURL(file)

    // Reset the input value so the same file can be loaded again
    if (e.target) {
      e.target.value = ""
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 p-2 border-r border-gray-200 bg-gray-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={addRectangle}>
              <Square className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Rectangle</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={addCircle}>
              <CircleIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Circle</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={addLine}>
              <Minus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Line</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={addText}>
              <Type className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Text</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={addTriangle}>
              <Triangle className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Triangle</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={loadImage}>
              <Image className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Load Image</TooltipContent>
        </Tooltip>

        <div className="h-px bg-gray-200 my-2" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={deleteObject} disabled={!selectedObject}>
              <Trash2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Delete</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={duplicateObject} disabled={!selectedObject}>
              <Copy className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Duplicate</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={groupObjects}>
              <Group className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Group Objects (Ctrl+G)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={ungroupObjects}>
              <Ungroup className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Ungroup Objects (Ctrl+Shift+G)</TooltipContent>
        </Tooltip>

        <div className="h-px bg-gray-200 my-2" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={undo}>
              <Undo className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={redo}>
              <Redo className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Redo</TooltipContent>
        </Tooltip>

        <div className="h-px bg-gray-200 my-2" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={saveCanvasAsJSON}>
              <Save className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Save as JSON</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={saveCanvasAsPNG}>
              <Download className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Save as PNG</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={loadCanvasFromJSON}>
              <FolderOpen className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Load from JSON</TooltipContent>
        </Tooltip>
      </div>

      {/* Hidden file inputs */}
      <input type="file" ref={fileInputRef} style={{ display: "none" }} accept=".json" onChange={handleJSONFileLoad} />
      <input type="file" ref={imageInputRef} style={{ display: "none" }} accept="image/*" onChange={handleImageLoad} />
    </TooltipProvider>
  )
}


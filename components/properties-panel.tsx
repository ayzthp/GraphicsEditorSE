"use client"

import type React from "react"

import { useEditorStore } from "@/store/editor-store"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import type { IText } from "fabric"

export default function PropertiesPanel() {
  const { canvas, selectedObject, saveState } = useEditorStore()
  const [fill, setFill] = useState("#000000")
  const [stroke, setStroke] = useState("#000000")
  const [strokeWidth, setStrokeWidth] = useState(1)
  const [opacity, setOpacity] = useState(100)
  const [fontSize, setFontSize] = useState(24)
  const [text, setText] = useState("")

  useEffect(() => {
    if (!selectedObject) return

    setFill((selectedObject.fill as string) || "#000000")
    setStroke((selectedObject.stroke as string) || "#000000")
    setStrokeWidth(selectedObject.strokeWidth || 1)
    setOpacity(selectedObject.opacity ? selectedObject.opacity * 100 : 100)

    if (selectedObject.type === "i-text") {
      const textObj = selectedObject as IText
      setFontSize(textObj.fontSize || 24)
      setText(textObj.text || "")
    }
  }, [selectedObject])

  const updateProperty = (property: string, value: any) => {
    if (!canvas || !selectedObject) return

    selectedObject.set({ [property]: value })
    canvas.renderAll()
  }

  const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFill(value)
    updateProperty("fill", value)
  }

  const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setStroke(value)
    updateProperty("stroke", value)
  }

  const handleStrokeWidthChange = (value: number[]) => {
    const width = value[0]
    setStrokeWidth(width)
    updateProperty("strokeWidth", width)
  }

  const handleOpacityChange = (value: number[]) => {
    const opacityValue = value[0]
    setOpacity(opacityValue)
    updateProperty("opacity", opacityValue / 100)
  }

  const handleFontSizeChange = (value: number[]) => {
    const size = value[0]
    setFontSize(size)
    updateProperty("fontSize", size)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setText(value)
    updateProperty("text", value)
  }

  const applyChanges = () => {
    if (canvas) {
      saveState()
    }
  }

  if (!selectedObject) {
    return (
      <div className="p-4 border-l border-gray-200 bg-gray-50 w-64">
        <p className="text-gray-500 text-sm">No object selected</p>
      </div>
    )
  }

  return (
    <div className="p-4 border-l border-gray-200 bg-gray-50 w-64 overflow-y-auto">
      <h3 className="font-medium mb-4">Properties</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fill">Fill Color</Label>
          <div className="flex gap-2">
            <div className="w-8 h-8 border border-gray-300 rounded" style={{ backgroundColor: fill }} />
            <Input id="fill" type="color" value={fill} onChange={handleFillChange} onBlur={applyChanges} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stroke">Stroke Color</Label>
          <div className="flex gap-2">
            <div className="w-8 h-8 border border-gray-300 rounded" style={{ backgroundColor: stroke }} />
            <Input id="stroke" type="color" value={stroke} onChange={handleStrokeChange} onBlur={applyChanges} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="strokeWidth">Stroke Width</Label>
            <span className="text-sm">{strokeWidth}px</span>
          </div>
          <Slider
            id="strokeWidth"
            min={0}
            max={20}
            step={1}
            value={[strokeWidth]}
            onValueChange={handleStrokeWidthChange}
            onValueCommit={applyChanges}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="opacity">Opacity</Label>
            <span className="text-sm">{opacity}%</span>
          </div>
          <Slider
            id="opacity"
            min={0}
            max={100}
            step={1}
            value={[opacity]}
            onValueChange={handleOpacityChange}
            onValueCommit={applyChanges}
          />
        </div>

        {selectedObject.type === "i-text" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="text">Text</Label>
              <Input id="text" value={text} onChange={handleTextChange} onBlur={applyChanges} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="fontSize">Font Size</Label>
                <span className="text-sm">{fontSize}px</span>
              </div>
              <Slider
                id="fontSize"
                min={8}
                max={72}
                step={1}
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
                onValueCommit={applyChanges}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}


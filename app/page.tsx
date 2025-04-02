"use client"

import CanvasEditor from "@/components/canvas-editor"
import Toolbar from "@/components/toolbar"
import PropertiesPanel from "@/components/properties-panel"
import KeyboardShortcuts from "@/components/keyboard-shortcuts"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <main className="min-h-screen flex flex-col">
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-xl font-bold">Graphics Editor</h1>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <Toolbar />

          <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-gray-100">
            <CanvasEditor />
          </div>

          <PropertiesPanel />
        </div>

        <KeyboardShortcuts />
      </main>
    </ThemeProvider>
  )
}


import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // In a real application, you would fetch this data from a database
    // For now, we'll just return a mock response

    return NextResponse.json({
      objects: [],
      background: "#ffffff",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load canvas data" }, { status: 500 })
  }
}


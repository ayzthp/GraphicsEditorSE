import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // In a real application, you would save this data to a database
    // For now, we'll just return success

    return NextResponse.json({ success: true, id: Date.now().toString() })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save canvas data" }, { status: 500 })
  }
}


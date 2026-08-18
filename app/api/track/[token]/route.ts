import { NextResponse } from "next/server"
import { trackToken } from "@/lib/queue-store"

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const data = trackToken(decodeURIComponent(token))
  if (!data) return NextResponse.json({ error: "Token not found" }, { status: 404 })
  return NextResponse.json(data)
}

import { NextResponse } from "next/server"
import { getQueue } from "@/lib/queue-store"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = getQueue(Number(id))
  if (!data) return NextResponse.json({ error: "Queue not found" }, { status: 404 })
  return NextResponse.json(data)
}

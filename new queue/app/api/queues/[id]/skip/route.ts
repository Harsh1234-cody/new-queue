import { NextResponse } from "next/server"
import { skipEntry } from "@/lib/queue-store"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const result = skipEntry(Number(id), body.token ?? "")
  if (!result) return NextResponse.json({ error: "Entry not found" }, { status: 404 })
  return NextResponse.json(result)
}

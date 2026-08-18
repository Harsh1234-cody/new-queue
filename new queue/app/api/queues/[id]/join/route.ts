import { NextResponse } from "next/server"
import { joinQueue } from "@/lib/queue-store"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const entry = joinQueue(Number(id), body.name ?? "", body.phone ?? "", body.venue ?? "", body.serviceType ?? "")
  if (!entry) return NextResponse.json({ error: "Queue not found" }, { status: 404 })
  return NextResponse.json(
    {
      token: entry.token,
      position: entry.position,
      etaMinutes: entry.etaMinutes,
      message: `You are #${entry.position} in the queue. Estimated wait: ${entry.etaMinutes} minutes.`,
    },
    { status: 201 },
  )
}

import { NextResponse } from "next/server"
import { getAnalytics } from "@/lib/queue-store"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json(getAnalytics(Number(id)))
}

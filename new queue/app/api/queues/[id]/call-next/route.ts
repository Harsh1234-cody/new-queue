import { NextResponse } from "next/server"
import { callNext } from "@/lib/queue-store"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json(callNext(Number(id)))
}

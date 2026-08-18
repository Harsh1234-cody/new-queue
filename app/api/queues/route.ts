import { NextResponse } from "next/server"
import { listQueues } from "@/lib/queue-store"

export async function GET() {
  return NextResponse.json(listQueues())
}

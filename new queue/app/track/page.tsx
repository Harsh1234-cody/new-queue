import { Suspense } from "react"
import { AppShell } from "@/components/app/app-shell"
import { TrackClient } from "@/components/app/track-client"

export default function TrackPage() {
  return (
    <AppShell active="Track">
      <Suspense fallback={<p className="text-center text-sm text-muted-foreground">Loading…</p>}>
        <TrackClient />
      </Suspense>
    </AppShell>
  )
}

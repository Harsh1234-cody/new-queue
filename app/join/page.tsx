import { AppShell } from "@/components/app/app-shell"
import { JoinClient } from "@/components/app/join-client"
import { RouteGuard } from "@/components/auth/route-guard"

export default function JoinPage() {
  return (
    <AppShell active="Join">
      <RouteGuard role="user">
        <JoinClient />
      </RouteGuard>
    </AppShell>
  )
}

import { AppShell } from "@/components/app/app-shell"
import { AdminClient } from "@/components/app/admin-client"
import { RouteGuard } from "@/components/auth/route-guard"

export default function AdminPage() {
  return (
    <AppShell active="Admin">
      <RouteGuard role="admin">
        <AdminClient />
      </RouteGuard>
    </AppShell>
  )
}

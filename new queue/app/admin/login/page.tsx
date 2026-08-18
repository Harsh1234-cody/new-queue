import { Suspense } from "react"
import { AuthShell } from "@/components/auth/auth-shell"
import { AdminLogin } from "@/components/auth/admin-login"

export default function AdminLoginPage() {
  return (
    <AuthShell>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <AdminLogin />
      </Suspense>
    </AuthShell>
  )
}

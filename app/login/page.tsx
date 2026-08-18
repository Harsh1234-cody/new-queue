import { Suspense } from "react"
import { AuthShell } from "@/components/auth/auth-shell"
import { UserLogin } from "@/components/auth/user-login"

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <UserLogin />
      </Suspense>
    </AuthShell>
  )
}

"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession, type Role } from "@/hooks/use-session"

/**
 * Gates a page by role.
 * - role="admin": only an admin session may pass, else redirect to /admin/login.
 * - role="user": any signed-in session may pass, else redirect to /login.
 */
export function RouteGuard({ role, children }: { role: Role; children: ReactNode }) {
  const { session, ready } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const authorized = role === "admin" ? session?.role === "admin" : Boolean(session)

  useEffect(() => {
    if (!ready || authorized) return
    const dest = role === "admin" ? "/admin/login" : "/login"
    router.replace(`${dest}?next=${encodeURIComponent(pathname)}`)
  }, [ready, authorized, role, router, pathname])

  if (!ready || !authorized) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking access…</p>
      </div>
    )
  }

  return <>{children}</>
}

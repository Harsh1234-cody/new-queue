"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { LogOut, LogIn } from "lucide-react"
import { useSession } from "@/hooks/use-session"

export function AppShell({ children, active }: { children: ReactNode; active?: string }) {
  const { session, ready, logout } = useSession()
  const router = useRouter()

  // Build role-aware navigation.
  const nav: { href: string; label: string }[] = []
  if (session?.role !== "admin") nav.push({ href: "/join", label: "Join" })
  nav.push({ href: "/track", label: "Track" })
  if (session?.role === "admin") nav.push({ href: "/admin", label: "Admin" })

  function handleLogout() {
    logout()
    router.replace("/")
  }

  return (
    <div data-skin="dark" className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <Link href="/" className="font-display text-lg font-extrabold tracking-tight">
            Smart<span className="text-primary">Queue</span>
          </Link>
          <nav className="flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active === n.label
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            ))}

            {ready && session ? (
              <div className="ml-2 flex items-center gap-2 border-l border-border pl-3">
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {session.role === "admin" ? "Admin" : session.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </button>
              </div>
            ) : ready ? (
              <Link
                href="/login"
                className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <LogIn className="h-3.5 w-3.5" /> Log in
              </Link>
            ) : null}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8 md:py-12">{children}</main>
    </div>
  )
}

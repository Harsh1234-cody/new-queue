"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, ShieldCheck, Ticket, AlertCircle } from "lucide-react"
import { useSession, ADMIN_USERNAME, ADMIN_PASSWORD } from "@/hooks/use-session"

export function AdminLogin() {
  const router = useRouter()
  const params = useSearchParams()
  const { loginAdmin } = useSession()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const next = params.get("next") || "/admin"

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const ok = loginAdmin(username, password)
    if (ok) {
      router.replace(next)
    } else {
      setError(true)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <ShieldCheck className="h-7 w-7" />
        </span>
        <h1 className="font-display text-3xl font-extrabold text-balance">Admin console login</h1>
        <p className="mt-2 text-sm text-muted-foreground">Staff access to manage and call queues.</p>
      </div>

      <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-6 md:p-8">
        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Username</span>
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              setError(false)
            }}
            required
            placeholder="admin"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            required
            placeholder="••••••••"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
          />
        </label>

        {error ? (
          <p className="mb-4 flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
            <AlertCircle className="h-3.5 w-3.5" /> Invalid credentials. Try again.
          </p>
        ) : null}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-display text-sm font-bold tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Sign in <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-4 rounded-lg bg-muted/60 px-3 py-2 text-center text-xs text-muted-foreground">
          Demo credentials - <span className="font-semibold text-foreground">{ADMIN_USERNAME}</span> /{" "}
          <span className="font-semibold text-foreground">{ADMIN_PASSWORD}</span>
        </p>
      </form>

      <Link
        href="/login"
        className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Ticket className="h-3.5 w-3.5" /> Just here to join a queue? User login
      </Link>
    </div>
  )
}

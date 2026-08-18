"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Ticket, ShieldCheck } from "lucide-react"
import { useSession } from "@/hooks/use-session"

export function UserLogin() {
  const router = useRouter()
  const params = useSearchParams()
  const { loginUser } = useSession()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const next = params.get("next") || "/join"

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    loginUser(name)
    router.replace(next)
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <Ticket className="h-7 w-7" />
        </span>
        <h1 className="font-display text-3xl font-extrabold text-balance">Sign in to join a queue</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us who you are and we&apos;ll hand you a virtual token.
        </p>
      </div>

      <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-6 md:p-8">
        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Full name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Priya Menon"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
          />
        </label>

        <label className="mb-6 block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Phone (optional)</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
          />
        </label>

        <button
          type="submit"
          disabled={!name.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-display text-sm font-bold tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <Link
        href="/admin/login"
        className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ShieldCheck className="h-3.5 w-3.5" /> Staff member? Go to admin login
      </Link>
    </div>
  )
}

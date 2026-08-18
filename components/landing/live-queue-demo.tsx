"use client"

import { useState } from "react"
import { Bell, SkipForward, PhoneCall, Activity } from "lucide-react"

type Person = { token: string; name: string; service: string; eta: number }

const INITIAL: Person[] = [
  { token: "Q-0042", name: "Aarav Sharma", service: "OPD Consult", eta: 0 },
  { token: "Q-0043", name: "Meera Nair", service: "Blood Test", eta: 4 },
  { token: "Q-0044", name: "Rohan Gupta", service: "X-Ray", eta: 8 },
  { token: "Q-0045", name: "Sara Khan", service: "OPD Consult", eta: 12 },
  { token: "Q-0046", name: "Dev Patel", service: "Pharmacy", eta: 16 },
]

let counter = 47

export function LiveQueueDemo() {
  const [queue, setQueue] = useState<Person[]>(INITIAL)
  const [served, setServed] = useState(128)
  const [toast, setToast] = useState<string | null>(null)

  function flash(msg: string) {
    setToast(msg)
    window.clearTimeout((flash as any)._t)
    ;(flash as any)._t = window.setTimeout(() => setToast(null), 2600)
  }

  function callNext() {
    setQueue((q) => {
      if (q.length <= 1) return q
      const [, ...rest] = q
      const reindexed = rest.map((p, i) => ({ ...p, eta: i * 4 }))
      flash(`Now serving ${rest[0]?.name ?? "next guest"}`)
      return reindexed
    })
    setServed((s) => s + 1)
  }

  function skip() {
    setQueue((q) => {
      if (q.length <= 1) return q
      const skipped = q[1]
      const rest = [q[0], ...q.slice(2)].map((p, i) => ({ ...p, eta: i * 4 }))
      if (skipped) flash(`${skipped.token} marked no-show`)
      return rest
    })
  }

  function join() {
    setQueue((q) => {
      const names = ["Isha Reddy", "Kabir Singh", "Nisha Rao", "Arjun Das", "Tara Bose"]
      const svc = ["OPD Consult", "Pharmacy", "Blood Test", "X-Ray"]
      const p: Person = {
        token: `Q-00${counter++}`,
        name: names[Math.floor(Math.random() * names.length)],
        service: svc[Math.floor(Math.random() * svc.length)],
        eta: q.length * 4,
      }
      flash(`${p.token} joined the queue`)
      return [...q, p]
    })
  }

  return (
    <div className="relative grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      {/* Queue visualization */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-bold text-card-foreground">Hospital OPD</p>
            <p className="text-sm text-muted-foreground">City General Hospital · Block A</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-3/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-3">
            <Activity className="h-3.5 w-3.5" />
            Live
          </span>
        </div>

        <ul className="flex flex-col gap-2">
          {queue.map((p, i) => {
            const serving = i === 0
            return (
              <li
                key={p.token}
                className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors ${
                  serving
                    ? "border-primary/40 bg-primary/10"
                    : "border-transparent bg-muted/50"
                }`}
              >
                <span
                  className={`font-display text-lg font-extrabold tabular-nums ${
                    serving ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-card-foreground">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.token} · {p.service}
                  </p>
                </div>
                {serving ? (
                  <span className="rounded-full bg-brand-3/15 px-2.5 py-1 text-xs font-semibold text-brand-3">
                    Serving
                  </span>
                ) : (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    ~{p.eta}m
                  </span>
                )}
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          onClick={join}
          className="mt-4 w-full rounded-xl border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          + Simulate someone joining
        </button>
      </div>

      {/* Admin controls */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="mb-5 font-display text-lg font-bold text-card-foreground">Counter Controls</p>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <p className="font-display text-2xl font-extrabold text-primary">{queue.length}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">In queue</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <p className="font-display text-2xl font-extrabold text-primary">{served}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Served today</p>
          </div>
        </div>

        <button
          type="button"
          onClick={callNext}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-display text-sm font-bold tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          <PhoneCall className="h-4 w-4" />
          Call Next
        </button>
        <button
          type="button"
          onClick={skip}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 font-display text-sm font-bold tracking-wide text-muted-foreground transition-colors hover:border-brand-3 hover:text-brand-3"
        >
          <SkipForward className="h-4 w-4" />
          Skip No-Show
        </button>

        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          Try it: call the next patient, skip a no-show, or add someone new. The queue re-orders and
          recalculates ETAs in real time.
        </p>
      </div>

      {/* Toast */}
      <div
        aria-live="polite"
        className={`pointer-events-none absolute -bottom-4 right-2 flex items-center gap-3 rounded-xl border border-border bg-popover px-4 py-3 shadow-xl transition-all duration-300 ${
          toast ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Bell className="h-4 w-4" />
        </span>
        <p className="text-sm font-medium text-popover-foreground">{toast ?? ""}</p>
      </div>
    </div>
  )
}

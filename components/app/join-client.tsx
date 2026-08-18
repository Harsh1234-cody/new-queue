"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { ArrowRight, MapPin, Users, Ticket, Clock, CheckCircle2, Copy } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type QueueSummary = {
  id: number
  name: string
  location: string
  venueLabel: string
  venues: string[]
  serviceTypes: string[]
  inQueue: number
  serving: string | null
}

type JoinResult = {
  token: string
  position: number
  etaMinutes: number
  message: string
}

export function JoinClient() {
  const { data: queues } = useSWR<QueueSummary[]>("/api/queues", fetcher, { refreshInterval: 4000 })
  const [selected, setSelected] = useState<QueueSummary | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [venue, setVenue] = useState("")
  const [service, setService] = useState("")
  const [result, setResult] = useState<JoinResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  function pickQueue(q: QueueSummary) {
    setSelected(q)
    // Default the selects to the first available example for this queue.
    setVenue(q.venues[0] ?? "")
    setService(q.serviceTypes[0] ?? "")
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || !name.trim() || !venue) return
    setSubmitting(true)
    const res = await fetch(`/api/queues/${selected.id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, venue, serviceType: service }),
    })
    const data = await res.json()
    setResult(data)
    setSubmitting(false)
  }

  if (result && selected) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-border bg-card p-8 text-center">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-3/15 text-brand-3">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h1 className="font-display text-2xl font-extrabold text-card-foreground">You&apos;re in the queue</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {selected.name}
            {venue ? <span className="font-medium text-foreground"> · {venue}</span> : null}
          </p>

          <div className="my-6 rounded-2xl bg-primary/10 py-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Your token</p>
            <p className="mt-1 font-display text-4xl font-extrabold tabular-nums text-primary">{result.token}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="font-display text-2xl font-extrabold text-card-foreground">#{result.position}</p>
              <p className="text-xs text-muted-foreground">Position</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="font-display text-2xl font-extrabold text-card-foreground">~{result.etaMinutes}m</p>
              <p className="text-xs text-muted-foreground">Est. wait</p>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(result.token)
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy token"}
            </button>
            <Link
              href={`/track?token=${result.token}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Track live <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-balance md:text-4xl">Join a queue</h1>
        <p className="mt-2 text-muted-foreground">Pick a counter, drop your details, and get a virtual token instantly.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Queue picker */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Choose a counter</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(queues ?? []).map((q) => {
              const active = selected?.id === q.id
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => pickQueue(q)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${
                    active ? "border-primary bg-primary/8" : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <p className="font-display font-bold text-card-foreground">{q.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" /> {q.location}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 font-medium text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> {q.inQueue} waiting
                    </span>
                    {q.serving ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-3/15 px-2 py-1 font-medium text-brand-3">
                        <Ticket className="h-3.5 w-3.5" /> {q.serving}
                      </span>
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6">
          <p className="mb-4 font-display text-lg font-bold text-card-foreground">Your details</p>

          <Field label="Full name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Priya Menon"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
            />
          </Field>

          <Field label="Phone (optional)">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
            />
          </Field>

          <Field label={selected ? selected.venueLabel : "Which venue?"}>
            <select
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              disabled={!selected}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {!selected ? (
                <option value="">Select a counter first</option>
              ) : (
                selected.venues.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))
              )}
            </select>
          </Field>

          <Field label="Service type">
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              disabled={!selected}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {!selected ? (
                <option value="">Select a counter first</option>
              ) : (
                selected.serviceTypes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))
              )}
            </select>
          </Field>

          {selected ? (
            <p className="mb-4 flex items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Joining <span className="font-semibold text-foreground">{selected.name}</span> - approx{" "}
              {selected.inQueue * 4}m wait
            </p>
          ) : (
            <p className="mb-4 text-xs text-muted-foreground">Select a counter on the left to continue.</p>
          )}

          <button
            type="submit"
            disabled={!selected || !name.trim() || !venue || submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-display text-sm font-bold tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Getting token…" : "Get my token"}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

"use client"

import { useState } from "react"
import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { Search, MapPin, Radio, PartyPopper } from "lucide-react"

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("not found")
    return r.json()
  })

type Tracked = {
  token: string
  name: string
  status: "waiting" | "serving" | "served" | "skipped"
  livePosition: number
  etaMinutes: number
  queueName: string
  queueLocation: string
}

export function TrackClient() {
  const params = useSearchParams()
  const [input, setInput] = useState(params.get("token") ?? "")
  const [token, setToken] = useState(params.get("token") ?? "")

  const { data, error, isLoading } = useSWR<Tracked>(
    token ? `/api/track/${encodeURIComponent(token)}` : null,
    fetcher,
    { refreshInterval: 3000 },
  )

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-extrabold text-balance md:text-4xl">Track your token</h1>
        <p className="mt-2 text-muted-foreground">Enter your token to watch your position update live.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          setToken(input.trim().toUpperCase())
        }}
        className="mb-6 flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Q-0042"
            className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-3 text-sm font-medium uppercase tracking-wider outline-none focus:border-ring"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-primary px-5 font-display text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Track
        </button>
      </form>

      {isLoading && token ? <p className="text-center text-sm text-muted-foreground">Looking up {token}…</p> : null}

      {error ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No token found matching <span className="font-semibold text-foreground">{token}</span>. Double-check and try
          again.
        </div>
      ) : null}

      {data ? <TrackCard data={data} /> : null}
    </div>
  )
}

function TrackCard({ data }: { data: Tracked }) {
  const serving = data.status === "serving"
  const served = data.status === "served"
  const skipped = data.status === "skipped"

  return (
    <div className="rounded-3xl border border-border bg-card p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-bold text-card-foreground">{data.queueName}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {data.queueLocation}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-3/15 px-3 py-1 text-xs font-semibold text-brand-3">
          <Radio className="h-3.5 w-3.5" /> Live
        </span>
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Token</p>
      <p className="font-display text-3xl font-extrabold tabular-nums text-primary">{data.token}</p>
      <p className="mt-1 text-sm text-muted-foreground">{data.name}</p>

      <div className="my-6 h-px bg-border" />

      {serving ? (
        <div className="rounded-2xl bg-brand-3/12 p-6 text-center">
          <PartyPopper className="mx-auto mb-2 h-8 w-8 text-brand-3" />
          <p className="font-display text-xl font-extrabold text-brand-3">It&apos;s your turn!</p>
          <p className="mt-1 text-sm text-muted-foreground">Please proceed to the counter now.</p>
        </div>
      ) : served ? (
        <div className="rounded-2xl bg-muted p-6 text-center">
          <p className="font-display text-xl font-extrabold text-foreground">Service complete</p>
          <p className="mt-1 text-sm text-muted-foreground">Thanks for using SmartQueue.</p>
        </div>
      ) : skipped ? (
        <div className="rounded-2xl bg-destructive/10 p-6 text-center">
          <p className="font-display text-xl font-extrabold text-destructive">Marked as no-show</p>
          <p className="mt-1 text-sm text-muted-foreground">Please rejoin the queue to get a new token.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="font-display text-4xl font-extrabold tabular-nums text-primary">#{data.livePosition}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">In line</p>
          </div>
          <div className="rounded-2xl bg-muted/60 p-6 text-center">
            <p className="font-display text-4xl font-extrabold tabular-nums text-foreground">~{data.etaMinutes}m</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Est. wait</p>
          </div>
        </div>
      )}

      <p className="mt-5 text-center text-xs text-muted-foreground">Auto-refreshing every few seconds.</p>
    </div>
  )
}

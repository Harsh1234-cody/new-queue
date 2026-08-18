"use client"

import { useState } from "react"
import useSWR from "swr"
import { PhoneCall, SkipForward, Users, CheckCheck, Clock, UserX, Megaphone } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type QueueSummary = { id: number; name: string; location: string; inQueue: number; serving: string | null }
type Entry = {
  id: number
  token: string
  name: string
  venue: string
  serviceType: string
  position: number
  status: string
  etaMinutes: number
}
type QueueDetail = { queue: QueueSummary; serving: Entry | null; entries: Entry[] }
type Analytics = {
  inQueue: number
  currentlyServing: number
  totalJoined: number
  totalServed: number
  totalSkipped: number
  avgWaitMin: number
}

export function AdminClient() {
  const { data: queues } = useSWR<QueueSummary[]>("/api/queues", fetcher, { refreshInterval: 4000 })
  const [activeId, setActiveId] = useState(1)

  const { data: detail, mutate: mutateDetail } = useSWR<QueueDetail>(
    `/api/queues/${activeId}`,
    fetcher,
    { refreshInterval: 3000 },
  )
  const { data: stats, mutate: mutateStats } = useSWR<Analytics>(
    `/api/queues/${activeId}/analytics`,
    fetcher,
    { refreshInterval: 3000 },
  )

  async function refresh() {
    await Promise.all([mutateDetail(), mutateStats()])
  }

  async function callNext() {
    await fetch(`/api/queues/${activeId}/call-next`, { method: "POST" })
    refresh()
  }
  async function skip(token: string) {
    await fetch(`/api/queues/${activeId}/skip`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
    refresh()
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Admin Console</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-balance md:text-4xl">Queue operations</h1>
        </div>
        <button
          onClick={callNext}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-display text-sm font-bold tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          <PhoneCall className="h-4 w-4" /> Call Next
        </button>
      </div>

      {/* Queue selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(queues ?? []).map((q) => (
          <button
            key={q.id}
            onClick={() => setActiveId(q.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeId === q.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {q.name}
            <span className="ml-2 rounded-full bg-black/10 px-1.5 py-0.5 text-xs tabular-nums">{q.inQueue}</span>
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={Users} label="In queue" value={stats?.inQueue ?? 0} />
        <Kpi icon={CheckCheck} label="Served today" value={stats?.totalServed ?? 0} />
        <Kpi icon={UserX} label="No-shows" value={stats?.totalSkipped ?? 0} />
        <Kpi icon={Clock} label="Avg wait" value={`${stats?.avgWaitMin ?? 0}m`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Now serving */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-card-foreground">
            <Megaphone className="h-5 w-5 text-primary" /> Now serving
          </p>
          {detail?.serving ? (
            <div className="rounded-2xl bg-primary/10 p-6 text-center">
              <p className="font-display text-4xl font-extrabold tabular-nums text-primary">{detail.serving.token}</p>
              <p className="mt-2 font-medium text-card-foreground">{detail.serving.name}</p>
              <p className="text-sm text-muted-foreground">
                {detail.serving.venue ? `${detail.serving.venue} · ` : ""}
                {detail.serving.serviceType}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-muted/60 p-6 text-center text-sm text-muted-foreground">
              No one is being served. Hit “Call Next” to begin.
            </div>
          )}
          <button
            onClick={callNext}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-display text-sm font-bold tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <PhoneCall className="h-4 w-4" /> Call Next
          </button>
        </div>

        {/* Waiting list */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-lg font-bold text-card-foreground">Waiting list</p>
            <span className="text-sm text-muted-foreground">{detail?.entries.length ?? 0} people</span>
          </div>
          {detail && detail.entries.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {detail.entries.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3"
                >
                  <span className="font-display text-lg font-extrabold tabular-nums text-muted-foreground">
                    {String(e.position).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-card-foreground">{e.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {e.token} · {e.venue ? `${e.venue} · ` : ""}
                      {e.serviceType} · ~{e.etaMinutes}m
                    </p>
                  </div>
                  <button
                    onClick={() => skip(e.token)}
                    aria-label={`Skip ${e.token}`}
                    className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <SkipForward className="h-3.5 w-3.5" /> Skip
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl bg-muted/60 px-4 py-8 text-center text-sm text-muted-foreground">
              Queue is empty.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Kpi({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <p className="font-display text-2xl font-extrabold text-card-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

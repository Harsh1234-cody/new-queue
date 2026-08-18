"use client"

import Link from "next/link"
import {
  ArrowRight,
  QrCode,
  BellRing,
  BarChart3,
  Clock,
  Users,
  ShieldCheck,
  Hospital,
  Landmark,
  Building2,
  UtensilsCrossed,
  Train,
  GraduationCap,
} from "lucide-react"
import { LiveQueueDemo } from "./live-queue-demo"

const STEPS = [
  { icon: QrCode, title: "Scan or Tap", desc: "Grab a virtual token from your phone - no paper slips, no standing in line." },
  { icon: Clock, title: "Track Live", desc: "Watch your position and live ETA update in real time from anywhere." },
  { icon: BellRing, title: "Get Alerted", desc: "A push notification pings you moments before your turn arrives." },
  { icon: BarChart3, title: "We Optimize", desc: "Staff see analytics and call the next person with a single tap." },
]

const CASES = [
  { icon: Hospital, name: "Hospitals & OPD", desc: "Patients wait in comfort instead of crowded corridors." },
  { icon: Landmark, name: "Banks", desc: "Route customers to the right teller and cut lobby congestion." },
  { icon: Building2, name: "Government Offices", desc: "Bring order and transparency to high-volume service desks." },
  { icon: UtensilsCrossed, name: "Restaurants", desc: "Remote waitlists let guests roam until their table is ready." },
  { icon: Train, name: "Ticket Counters", desc: "Keep stations moving with predictable, fair queueing." },
  { icon: GraduationCap, name: "Exam Centres", desc: "Manage verification and seating without the chaos." },
]

const BENEFITS = [
  { icon: Clock, title: "Up to 60% shorter waits", desc: "Smart routing and ETAs keep lines flowing." },
  { icon: Users, title: "Zero physical crowding", desc: "People wait remotely, not shoulder to shoulder." },
  { icon: BellRing, title: "Never miss a turn", desc: "Proactive alerts before each token is called." },
  { icon: ShieldCheck, title: "Fair & transparent", desc: "Everyone sees the same live order, no line-jumping." },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <nav className="sticky top-0 z-100 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur-xl md:px-10">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
          Smart<span className="text-primary">Queue</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#how" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How it works</a>
          <a href="#cases" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Use cases</a>
          <a href="#impact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Impact</a>
          <Link href="/admin/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Admin</Link>
        </div>
        <Link
          href="/join"
          className="rounded-lg border border-primary px-4 py-2 font-display text-sm font-bold tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Join a Queue
        </Link>
      </nav>

      {/* HERO */}
      <header className="smartqueue-grid relative overflow-hidden border-b border-border px-6 pb-16 pt-20 text-center md:px-10 md:pt-28">
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Real-time queue intelligence
          </span>
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-balance md:text-7xl">
            Skip the line,
            <span className="block text-primary">not the service.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            SmartQueue turns chaotic waiting rooms into calm, transparent, remote-first queues.
            Join from your phone, track your token live, and get pinged right before your turn.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-display text-sm font-bold tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Join a Queue <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-display text-sm font-bold tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Open Admin Console
            </Link>
          </div>

          <dl className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-6">
            {[
              ["60%", "Less waiting"],
              ["12k+", "Tokens served"],
              ["4.9★", "User rating"],
            ].map(([num, label]) => (
              <div key={label} className="text-center">
                <dd className="font-display text-3xl font-extrabold text-primary md:text-4xl">{num}</dd>
                <dt className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* LIVE DEMO */}
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Live Demo"
            title="See a queue breathe in real time"
            sub="This is the actual queue experience - interactive, right here. Call the next person, skip a no-show, or add a guest."
          />
          <LiveQueueDemo />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading label="How it works" title="Four taps to a calmer wait" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm font-extrabold text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-card-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section id="cases" className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Use cases"
            title="Built for anywhere people wait"
            sub="One platform, every counter. SmartQueue adapts to the rhythm of each service."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CASES.map(({ icon: Icon, name, desc }) => (
              <div
                key={name}
                className="group rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-1.5"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-2/12 text-brand-2">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-lg font-bold text-card-foreground">{name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading label="Impact" title="Waiting, reimagined" />
            <div className="flex flex-col gap-3">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium text-card-foreground">{title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              ["60", "%", "Shorter average wait"],
              ["3.2", "m", "Avg service time"],
              ["0", "", "Paper tokens used"],
              ["24", "/7", "Remote availability"],
            ].map(([num, unit, label]) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-6 text-center">
                <p className="font-display text-4xl font-extrabold leading-none text-primary">
                  {num}
                  <span className="text-2xl text-brand-2">{unit}</span>
                </p>
                <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-20 text-center md:px-10 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-4xl font-extrabold leading-tight text-balance md:text-6xl">
            Ready to <span className="text-primary">end the line?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            Spin up a queue in minutes. No hardware, no paper, no crowds - just a smoother experience
            for everyone who walks in.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-display text-sm font-bold tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Join a Queue <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-7 py-3.5 font-display text-sm font-bold tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Track my token
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col items-center justify-between gap-3 border-t border-border px-6 py-8 text-sm text-muted-foreground md:flex-row md:px-10">
        <p className="font-display font-bold text-foreground">
          Smart<span className="text-primary">Queue</span>
        </p>
        <p>Skip the line, not the service.</p>
        <p>© {new Date().getFullYear()} SmartQueue</p>
      </footer>

    </div>
  )
}

function SectionHeading({
  label,
  title,
  sub,
}: {
  label: string
  title: string
  sub?: string
}) {
  return (
    <div className="mb-10 md:mb-12">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">{label}</p>
      <h2 className="max-w-2xl font-display text-3xl font-extrabold leading-tight text-balance md:text-5xl">
        {title}
      </h2>
      {sub ? <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground">{sub}</p> : null}
    </div>
  )
}

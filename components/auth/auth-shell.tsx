import Link from "next/link"
import type { ReactNode } from "react"

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div data-skin="dark" className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center px-5 py-3.5">
          <Link href="/" className="font-display text-lg font-extrabold tracking-tight">
            Smart<span className="text-primary">Queue</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-12">{children}</main>
    </div>
  )
}

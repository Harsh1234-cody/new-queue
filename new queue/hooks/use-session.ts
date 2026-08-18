"use client"

import { useCallback, useEffect, useState } from "react"

// Lightweight demo auth for the SmartQueue prototype.
// The app uses an in-memory store, so sessions live in localStorage.
// Demo admin credentials: username "admin", password "admin123".

export type Role = "user" | "admin"
export type Session = { role: Role; name: string } | null

const KEY = "smartqueue_session"
const EVENT = "smartqueue_session_change"

export const ADMIN_USERNAME = "admin"
export const ADMIN_PASSWORD = "admin123"

function read(): Session {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function write(session: Session) {
  if (typeof window === "undefined") return
  if (session) window.localStorage.setItem(KEY, JSON.stringify(session))
  else window.localStorage.removeItem(KEY)
  window.dispatchEvent(new Event(EVENT))
}

export function useSession() {
  const [session, setSession] = useState<Session>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setSession(read())
    setReady(true)
    const sync = () => setSession(read())
    window.addEventListener(EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  const loginUser = useCallback((name: string) => {
    write({ role: "user", name: name.trim() || "Guest" })
  }, [])

  const loginAdmin = useCallback((username: string, password: string) => {
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      write({ role: "admin", name: "Admin" })
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => write(null), [])

  return { session, ready, loginUser, loginAdmin, logout }
}

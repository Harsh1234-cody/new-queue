// In-memory queue store - mirrors the Flask/MySQL SmartQueue backend.
// Persists across requests within a running server via globalThis.

export type EntryStatus = "waiting" | "serving" | "served" | "skipped"

export type QueueEntry = {
  id: number
  queueId: number
  token: string
  name: string
  phone: string
  venue: string
  serviceType: string
  position: number
  status: EntryStatus
  joinedAt: string
  servedAt: string | null
  etaMinutes: number
}

export type Queue = {
  id: number
  name: string
  category: string
  /** Label for the venue selector, e.g. "Which hospital?" */
  venueLabel: string
  /** Specific places the user can pick from. */
  venues: string[]
  /** Example service types offered for this category. */
  serviceTypes: string[]
  location: string
  isActive: boolean
}

type Store = {
  queues: Queue[]
  entries: QueueEntry[]
  entrySeq: number
  tokenSeq: Record<number, number>
}

const AVG_SERVICE_MIN = 4

const g = globalThis as unknown as { __smartqueue?: Store }

function seed(): Store {
  const queues: Queue[] = [
    {
      id: 1,
      name: "Hospital OPD",
      category: "hospital",
      venueLabel: "Which hospital?",
      venues: [
        "Apollo Hospital",
        "Fortis Healthcare",
        "Max Super Speciality",
        "AIIMS Delhi",
        "Manipal Hospital",
        "Narayana Health",
        "Medanta - The Medicity",
        "Kokilaben Hospital",
        "Lilavati Hospital",
        "Tata Memorial Hospital",
        "Ruby Hall Clinic",
        "KIMS Hospital",
        "Care Hospitals",
        "Global Hospitals",
      ],
      serviceTypes: [
        "OPD Consultation",
        "Blood Test",
        "X-Ray / Scan",
        "Pharmacy",
        "Vaccination",
        "Report Collection",
      ],
      location: "City General Hospital, Block A",
      isActive: true,
    },
    {
      id: 2,
      name: "Bank Teller",
      category: "bank",
      venueLabel: "Which bank?",
      venues: [
        "State Bank of India (SBI)",
        "HDFC Bank",
        "ICICI Bank",
        "Axis Bank",
        "Punjab National Bank",
        "Bank of Baroda",
        "Kotak Mahindra Bank",
        "Canara Bank",
        "Union Bank of India",
        "IDBI Bank",
        "Yes Bank",
        "IndusInd Bank",
        "Central Bank of India",
      ],
      serviceTypes: [
        "New Account",
        "Cash Deposit / Withdrawal",
        "Loan Enquiry",
        "Cheque Clearance",
        "Locker Service",
        "KYC Update",
      ],
      location: "SBI Main Branch, MG Road",
      isActive: true,
    },
    {
      id: 3,
      name: "Government Office",
      category: "government",
      venueLabel: "Which branch / department?",
      venues: [
        "Passport Seva Kendra",
        "Regional Transport Office (RTO)",
        "Municipal Corporation",
        "Aadhaar Enrolment Centre",
        "Income Tax Office",
        "GST Seva Kendra",
        "Sub-Registrar Office",
        "Electricity Board Office",
        "Ration Card Office",
        "Employment Exchange",
        "District Collectorate",
        "Public Distribution Office",
      ],
      serviceTypes: [
        "New Application",
        "Document Submission",
        "Verification",
        "Renewal",
        "Payment / Fees",
        "Grievance",
      ],
      location: "Municipal Corporation, Floor 2",
      isActive: true,
    },
    {
      id: 4,
      name: "Restaurant Waitlist",
      category: "restaurant",
      venueLabel: "Which restaurant?",
      venues: [
        "The Grand Café",
        "Barbeque Nation",
        "Mainland China",
        "Saravana Bhavan",
        "Punjab Grill",
        "Truffles",
        "SOCIAL",
        "Big Chill Café",
        "Paradise Biryani",
        "Karim's",
        "Bikanervala",
        "Wow! Momo",
        "The Table",
        "Farzi Café",
      ],
      serviceTypes: [
        "Table for 2",
        "Table for 4",
        "Table for 6+",
        "Bar Seating",
        "Takeaway",
        "Private Dining",
      ],
      location: "The Grand Café",
      isActive: true,
    },
    {
      id: 5,
      name: "Ticket Counter",
      category: "transport",
      venueLabel: "Which transport service?",
      venues: [
        "IRCTC Railways",
        "RedBus",
        "KSRTC (Karnataka)",
        "APSRTC (Andhra)",
        "MSRTC (Maharashtra)",
        "IndiGo Airlines",
        "Air India",
        "Vistara",
        "SpiceJet",
        "Ola Cabs",
        "Uber",
        "Metro Rail (DMRC)",
        "Volvo Intercity",
        "AbhiBus",
      ],
      serviceTypes: [
        "New Booking",
        "Cancellation",
        "Refund",
        "Reschedule",
        "General Enquiry",
      ],
      location: "Central Railway Station",
      isActive: true,
    },
    {
      id: 6,
      name: "Exam Centre",
      category: "exam",
      venueLabel: "For which exam?",
      venues: [
        "UPSC Civil Services",
        "SSC CGL",
        "IBPS PO",
        "NEET UG",
        "JEE Main",
        "GATE",
        "CAT",
        "CLAT",
        "RRB NTPC",
        "UGC NET",
        "State PSC",
        "IELTS / TOEFL",
        "GRE",
        "CBSE Board Exam",
      ],
      serviceTypes: [
        "Registration",
        "Document Verification",
        "Hall Ticket Collection",
        "Fee Payment",
        "Query Desk",
      ],
      location: "Board Exam Hall, Block C",
      isActive: true,
    },
  ]

  const store: Store = { queues, entries: [], entrySeq: 1, tokenSeq: {} }

  // Pre-seed a few waiting people in the Hospital OPD queue.
  const sample = [
    { name: "Aarav Sharma", venue: "Apollo Hospital", service: "OPD Consultation" },
    { name: "Meera Nair", venue: "Apollo Hospital", service: "Blood Test" },
    { name: "Rohan Gupta", venue: "Apollo Hospital", service: "X-Ray / Scan" },
    { name: "Sara Khan", venue: "Apollo Hospital", service: "OPD Consultation" },
  ]
  sample.forEach((s) => addEntryTo(store, 1, s.name, "", s.venue, s.service))
  // Mark the first as currently serving.
  const first = store.entries.find((e) => e.queueId === 1 && e.status === "waiting")
  if (first) first.status = "serving"

  return store
}

function addEntryTo(
  store: Store,
  queueId: number,
  name: string,
  phone: string,
  venue: string,
  serviceType: string,
): QueueEntry {
  const waiting = store.entries.filter((e) => e.queueId === queueId && e.status === "waiting")
  const position = waiting.length + 1
  store.tokenSeq[queueId] = (store.tokenSeq[queueId] ?? 0) + 1
  const token = `Q-${String(store.tokenSeq[queueId]).padStart(4, "0")}`
  const entry: QueueEntry = {
    id: store.entrySeq++,
    queueId,
    token,
    name: name || "Guest",
    phone,
    venue: venue || "",
    serviceType: serviceType || "General",
    position,
    status: "waiting",
    joinedAt: new Date().toISOString(),
    servedAt: null,
    etaMinutes: Math.max(0, position - 1) * AVG_SERVICE_MIN,
  }
  store.entries.push(entry)
  return entry
}

function getStore(): Store {
  if (!g.__smartqueue) g.__smartqueue = seed()
  return g.__smartqueue
}

export function listQueues() {
  const store = getStore()
  return store.queues
    .filter((q) => q.isActive)
    .map((q) => ({
      id: q.id,
      name: q.name,
      category: q.category,
      venueLabel: q.venueLabel,
      venues: q.venues,
      serviceTypes: q.serviceTypes,
      location: q.location,
      inQueue: store.entries.filter((e) => e.queueId === q.id && e.status === "waiting").length,
      serving: store.entries.find((e) => e.queueId === q.id && e.status === "serving")?.token ?? null,
    }))
}

export function getQueue(queueId: number) {
  const store = getStore()
  const queue = store.queues.find((q) => q.id === queueId)
  if (!queue) return null
  const serving = store.entries.find((e) => e.queueId === queueId && e.status === "serving") ?? null
  const waiting = store.entries
    .filter((e) => e.queueId === queueId && e.status === "waiting")
    .sort((a, b) => a.position - b.position)
  return { queue, serving, entries: waiting }
}

export function joinQueue(
  queueId: number,
  name: string,
  phone: string,
  venue: string,
  serviceType: string,
) {
  const store = getStore()
  const queue = store.queues.find((q) => q.id === queueId)
  if (!queue) return null
  const entry = addEntryTo(store, queueId, name, phone, venue, serviceType)
  return entry
}

export function trackToken(token: string) {
  const store = getStore()
  const entry = store.entries.find((e) => e.token === token)
  if (!entry) return null
  const queue = store.queues.find((q) => q.id === entry.queueId)!

  let livePosition = 0
  let liveEta = 0
  if (entry.status === "waiting") {
    const ahead = store.entries.filter(
      (e) => e.queueId === entry.queueId && e.status === "waiting" && e.position < entry.position,
    ).length
    livePosition = ahead + 1
    liveEta = Math.max(0, livePosition - 1) * AVG_SERVICE_MIN
  } else if (entry.status === "serving") {
    livePosition = 0
  }

  return {
    token: entry.token,
    name: entry.name,
    status: entry.status,
    venue: entry.venue,
    serviceType: entry.serviceType,
    livePosition,
    etaMinutes: liveEta,
    queueName: queue.name,
    queueLocation: queue.location,
  }
}

export function callNext(queueId: number) {
  const store = getStore()
  const current = store.entries.find((e) => e.queueId === queueId && e.status === "serving")
  if (current) {
    current.status = "served"
    current.servedAt = new Date().toISOString()
  }
  const next = store.entries
    .filter((e) => e.queueId === queueId && e.status === "waiting")
    .sort((a, b) => a.position - b.position)[0]
  if (!next) return { message: "Queue is empty", next: null }
  next.status = "serving"
  reindex(store, queueId)
  return { message: `Now serving ${next.name}`, next }
}

export function skipEntry(queueId: number, token: string) {
  const store = getStore()
  const entry = store.entries.find((e) => e.queueId === queueId && e.token === token)
  if (!entry) return null
  entry.status = "skipped"
  reindex(store, queueId)
  return { message: `Token ${token} skipped` }
}

function reindex(store: Store, queueId: number) {
  const waiting = store.entries
    .filter((e) => e.queueId === queueId && e.status === "waiting")
    .sort((a, b) => a.position - b.position)
  waiting.forEach((e, i) => {
    e.position = i + 1
    e.etaMinutes = i * AVG_SERVICE_MIN
  })
}

export function getAnalytics(queueId: number) {
  const store = getStore()
  const all = store.entries.filter((e) => e.queueId === queueId)
  const served = all.filter((e) => e.status === "served")
  const avgWait =
    served.length === 0
      ? 0
      : Math.round(
          served.reduce((acc, e) => {
            const diff = e.servedAt ? (new Date(e.servedAt).getTime() - new Date(e.joinedAt).getTime()) / 60000 : 0
            return acc + diff
          }, 0) / served.length,
        )

  return {
    inQueue: all.filter((e) => e.status === "waiting").length,
    currentlyServing: all.filter((e) => e.status === "serving").length,
    totalJoined: all.length,
    totalServed: served.length,
    totalSkipped: all.filter((e) => e.status === "skipped").length,
    avgWaitMin: avgWait,
  }
}

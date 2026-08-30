const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 5

type Store = Map<string, number[]>
const globalStore = globalThis as unknown as { __rflLeadRateLimit?: Store }
const store = globalStore.__rflLeadRateLimit ?? new Map<string, number[]>()
globalStore.__rflLeadRateLimit = store

export function allowSubmission(ip: string, now = Date.now()) {
  const existing = store.get(ip) ?? []
  const recent = existing.filter((timestamp) => now - timestamp < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    store.set(ip, recent)
    return false
  }
  recent.push(now)
  store.set(ip, recent)
  return true
}

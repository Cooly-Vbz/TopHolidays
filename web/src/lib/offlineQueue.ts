type Queued = { id: string; url: string; options: RequestInit }

const KEY = 'offline-queue'

export function enqueue(url: string, options: RequestInit = {}) {
  const q: Queued[] = JSON.parse(localStorage.getItem(KEY) || '[]')
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,7)}`
  q.push({ id, url, options })
  localStorage.setItem(KEY, JSON.stringify(q))
}

export async function flushOnReconnect() {
  if (!navigator.onLine) return
  const q: Queued[] = JSON.parse(localStorage.getItem(KEY) || '[]')
  const remaining: Queued[] = []
  for (const item of q) {
    try {
      await fetch(item.url, item.options)
    } catch {
      remaining.push(item)
    }
  }
  localStorage.setItem(KEY, JSON.stringify(remaining))
}

export function installQueueListener() {
  window.addEventListener('online', () => { flushOnReconnect() })
}
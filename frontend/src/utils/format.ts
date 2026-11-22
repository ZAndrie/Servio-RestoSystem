/**
 * Servio Formatting Utilities (Term 3: Tabular Numbers & PHP Currency, Asia/Manila time)
 */

export const phCurrencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatCurrency = (amount: number): string => {
  return phCurrencyFormatter.format(Number.isFinite(amount) ? amount : 0)
}

export const getManilaHour = (date: Date = new Date()): number => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(date)
  const hourStr = parts.find((p) => p.type === 'hour')?.value ?? '12'
  return Number(hourStr) % 24
}

export const getManilaGreeting = (fullName?: string | null): string => {
  const hour = getManilaHour()
  let salutation = 'Good evening'
  if (hour >= 5 && hour < 12) salutation = 'Good morning'
  else if (hour >= 12 && hour < 18) salutation = 'Good afternoon'

  const firstName = fullName?.trim().split(/\s+/)[0]
  return firstName ? `${salutation}, ${firstName}` : salutation
}

export const getManilaDateISO = (date: Date = new Date()): string => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const y = parts.find((p) => p.type === 'year')?.value ?? '2026'
  const m = parts.find((p) => p.type === 'month')?.value ?? '01'
  const d = parts.find((p) => p.type === 'day')?.value ?? '01'
  return `${y}-${m}-${d}`
}

export const formatElapsedClock = (isoDate: string, nowMs: number = Date.now()): string => {
  const created = new Date(isoDate).getTime()
  const totalSeconds = Math.max(0, Math.floor((nowMs - created) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  if (hours > 0) return `${hours}:${pad(mins)}:${pad(secs)}`
  return `${pad(mins)}:${pad(secs)}`
}

export const getElapsedMinutes = (isoDate: string, nowMs: number = Date.now()): number => {
  const created = new Date(isoDate).getTime()
  return Math.max(0, Math.floor((nowMs - created) / 60000))
}

export const formatDateTimePH = (isoDate?: string | null): string => {
  const d = isoDate ? new Date(isoDate) : new Date()
  return d.toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export const formatTimePH = (isoDate?: string | null): string => {
  const d = isoDate ? new Date(isoDate) : new Date()
  return d.toLocaleTimeString('en-PH', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

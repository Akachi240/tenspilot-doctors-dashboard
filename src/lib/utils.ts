import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a date for display */
export function formatDate(date: Date | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

/** Format a date for table rows (YYYY-MM-DD) */
export function formatDateShort(date: Date | undefined): string {
  if (!date) return '—'
  return date.toISOString().split('T')[0]
}

/** Format time (HH:MM) */
export function formatTime(date: Date | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

/** Calculate pain relief (before - after) */
export function calculatePainRelief(before: number, after: number): number {
  return Math.max(0, before - after)
}

/** Generate a random 6-digit access code */
export function generateAccessCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/** Get emoji for TENS mode */
export function getModeEmoji(modeId: string): string {
  switch (modeId) {
    case 'neuropathy':
      return '🧠'
    case 'musculoskeletal':
      return '💪'
    case 'period':
      return '🌸'
    case 'general':
    default:
      return '⚡'
  }
}

/** Color class for relief score */
export function getReliefColor(relief: number): string {
  if (relief >= 6) return 'text-emerald-400'
  if (relief >= 3) return 'text-amber-400'
  return 'text-red-400'
}

/** Background class for relief score */
export function getReliefBg(relief: number): string {
  if (relief >= 6) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
  if (relief >= 3) return 'bg-amber-500/15 text-amber-400 border-amber-500/20'
  return 'bg-red-500/15 text-red-400 border-red-500/20'
}

/** Color class for pain score */
export function getPainColor(pain: number): string {
  if (pain >= 7) return 'text-red-400'
  if (pain >= 4) return 'text-amber-400'
  return 'text-emerald-400'
}

/** Time ago string */
export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

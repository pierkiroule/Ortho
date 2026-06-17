import { weatherOptions } from '../data/echomood'
import { fromCompactEchoMood, toCompactEchoMood } from './synthesis'
import type { EchoMood } from '../types/domain'
import type { EchoMoodEntry, EducationalTip } from '../types/domain'

type LegacyEchoMoodEntry = EchoMoodEntry & { tips?: EducationalTip[] }

const storageKey = 'echomood-ortho.history.v2'
const legacyStorageKey = 'echomood-ortho.history.v1'

export const weatherScores = Object.fromEntries(weatherOptions.map((option, index) => [option.id, weatherOptions.length - index])) as Record<string, number>

export function getWeatherScore(weatherId: string) {
  return weatherScores[weatherId] ?? 0
}

export function loadHistory(): EchoMoodEntry[] {
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (raw) {
      const parsed = JSON.parse(raw) as EchoMood[]
      return Array.isArray(parsed) ? parsed.map(fromCompactEchoMood).sort((a, b) => a.createdAt.localeCompare(b.createdAt)) : []
    }
    const legacyRaw = window.localStorage.getItem(legacyStorageKey)
    if (!legacyRaw) return []
    const parsed = JSON.parse(legacyRaw) as LegacyEchoMoodEntry[]
    return Array.isArray(parsed)
      ? parsed
          .map((entry) => {
            const migrated = { ...entry, perspective: entry.perspective ?? 'patient', impactScore: entry.impactScore ?? null, tip: entry.tip ?? entry.tips?.[0] ?? null, treatmentWeight: entry.treatmentWeight ?? null }
            return { ...migrated, echoMood: migrated.echoMood ?? toCompactEchoMood(migrated) }
          })
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      : []
  } catch {
    return []
  }
}

export function saveHistory(entries: EchoMoodEntry[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(entries.map((entry) => entry.echoMood ?? toCompactEchoMood(entry))))
}

export function upsertEntry(entry: EchoMoodEntry) {
  const entries = loadHistory().filter((item) => item.id !== entry.id)
  const next = [...entries, entry].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  saveHistory(next)
  return next
}

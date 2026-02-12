import type { GameSnapshot } from './types'

const SNAPSHOT_KEY = '2048:snapshot:v1'

export function loadSnapshot(): GameSnapshot | null {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as unknown
    if (!isSnapshot(data)) return null
    return data
  } catch {
    return null
  }
}

export function saveSnapshot(snapshot: GameSnapshot) {
  try {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot))
  } catch {
    // ignore storage failures (private mode, quota, etc.)
  }
}

export function clearSnapshot() {
  try {
    localStorage.removeItem(SNAPSHOT_KEY)
  } catch {
    // ignore
  }
}

function isSnapshot(v: unknown): v is GameSnapshot {
  if (!v || typeof v !== 'object') return false
  const s = v as Record<string, unknown>
  if (typeof s.size !== 'number') return false
  if (typeof s.score !== 'number') return false
  if (typeof s.best !== 'number') return false
  if (typeof s.status !== 'string') return false
  if (typeof s.keepPlaying !== 'boolean') return false
  if (typeof s.nextTileId !== 'number') return false
  if (!Array.isArray(s.tiles)) return false
  for (const t of s.tiles) {
    if (!t || typeof t !== 'object') return false
    const tt = t as Record<string, unknown>
    if (typeof tt.id !== 'number') return false
    if (typeof tt.value !== 'number') return false
    if (typeof tt.row !== 'number') return false
    if (typeof tt.col !== 'number') return false
  }
  return true
}


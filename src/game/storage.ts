import type { GameSnapshot } from './types'

const BEST_SCORE_KEY = '2048:best:v1'

export function loadSnapshot(): GameSnapshot | null {
  return null // Always return null to start fresh game
}

export function saveSnapshot(snapshot: GameSnapshot) {
  // Only save the best score
  try {
    const currentBest = loadBestScore()
    if (snapshot.best > currentBest) {
      localStorage.setItem(BEST_SCORE_KEY, String(snapshot.best))
    }
  } catch {
    // ignore storage failures
  }
}

export function clearSnapshot() {
  // Keep best score, don't clear it
}

export function loadBestScore(): number {
  try {
    const raw = localStorage.getItem(BEST_SCORE_KEY)
    if (!raw) return 0
    const best = Number.parseInt(raw, 10)
    return Number.isNaN(best) ? 0 : best
  } catch {
    return 0
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


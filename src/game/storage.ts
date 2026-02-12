import type {GameSnapshot} from './types'

const BEST_SCORE_KEY = '2048:best:v1'

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


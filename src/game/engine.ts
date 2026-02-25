import type {Direction, GameState, Tile} from './types'

export type Rng = () => number

function key(row: number, col: number) {
    return `${row},${col}`
}

function range(n: number) {
    return Array.from({length: n}, (_, i) => i)
}

function pickRandom<T>(arr: T[], rng: Rng): T | undefined {
    if (arr.length === 0) return undefined
    const idx = Math.floor(rng() * arr.length)
    return arr[idx]
}

// Keep tile ids monotonic across games when desired, so Vue keys do not get reused on restart.
export function createNewGame(size: number, best: number, rng: Rng, nextTileIdStart = 1): GameState {
    let state: GameState = {
        size,
        score: 0,
        best,
        status: 'playing',
        keepPlaying: false,
        nextTileId: nextTileIdStart,
        tiles: [],
    }

    state = spawnRandomTile(state, rng)
    state = spawnRandomTile(state, rng)
    return state
}

export function setKeepPlaying(state: GameState, keepPlaying: boolean): GameState {
    // Do not downgrade a lost game back to playing.
    if (state.status === 'lost' && keepPlaying) return state
    return {
        ...state,
        keepPlaying,
        status: state.status === 'won' && keepPlaying ? 'playing' : state.status,
    }
}

export function move(state: GameState, direction: Direction, rng: Rng): GameState {
    if (state.status === 'lost') return state
    if (state.status === 'won' && !state.keepPlaying) return state

    const tileByPos = new Map<string, Tile>()
    for (const t of state.tiles) tileByPos.set(key(t.row, t.col), t)

    const lines = getLines(state.size, direction)
    let nextTileId = state.nextTileId
    let scoreDelta = 0
    let moved = false
    const nextTiles: Tile[] = []

    for (const line of lines) {
        let target = 0
        let prev: Tile | null = null
        let prevMerged = false

        for (const pos of line) {
            const t = tileByPos.get(key(pos.row, pos.col))
            if (!t) continue

            const targetPos = line[target]!
            if (prev && !prevMerged && prev.value === t.value) {
                // Merge into previous target position.
                const mergedValue = prev.value * 2
                const mergedTile: Tile = {
                    id: nextTileId++,
                    value: mergedValue,
                    row: prev.row,
                    col: prev.col,
                    justMerged: true,
                }

                // Replace the previously emitted tile with the merged one.
                nextTiles.pop()
                nextTiles.push(mergedTile)

                scoreDelta += mergedValue
                prev = mergedTile
                prevMerged = true

                moved = true
                continue
            }

            const movedTile: Tile = {
                id: t.id,
                value: t.value,
                row: targetPos.row,
                col: targetPos.col,
            }
            nextTiles.push(movedTile)

            if (t.row !== movedTile.row || t.col !== movedTile.col) moved = true

            prev = movedTile
            prevMerged = false
            target += 1
        }
    }

    if (!moved) return state

    let nextState: GameState = {
        ...state,
        nextTileId,
        score: state.score + scoreDelta,
        tiles: nextTiles,
    }
    nextState = spawnRandomTile(nextState, rng)
    nextState = updateStatusAndBest(nextState)
    return nextState
}

export function clearTransientFlags(state: GameState): GameState {
    const nextTiles = state.tiles.map((t) => {
        if (!t.justMerged && !t.justSpawned) return t
        const {justMerged: _jm, justSpawned: _js, ...rest} = t
        return rest
    })
    return {...state, tiles: nextTiles}
}

function spawnRandomTile(state: GameState, rng: Rng): GameState {
    const occupied = new Set(state.tiles.map((t) => key(t.row, t.col)))
    const empties: Array<{ row: number; col: number }> = []
    for (const row of range(state.size)) {
        for (const col of range(state.size)) {
            if (!occupied.has(key(row, col))) empties.push({row, col})
        }
    }

    const spot = pickRandom(empties, rng)
    if (!spot) return state

    const value = rng() < 0.9 ? 2 : 4
    const tile: Tile = {id: state.nextTileId, value, row: spot.row, col: spot.col, justSpawned: true}
    return {...state, nextTileId: state.nextTileId + 1, tiles: [...state.tiles, tile]}
}

function updateStatusAndBest(state: GameState): GameState {
    const max = state.tiles.reduce((m, t) => Math.max(m, t.value), 0)
    const best = Math.max(state.best, state.score)

    let status = state.status
    if (max >= 2048 && !state.keepPlaying) status = 'won'
    if (status !== 'won' && !canMove(state.size, state.tiles)) status = 'lost'

    return {...state, best, status}
}

function canMove(size: number, tiles: Tile[]) {
    if (tiles.length < size * size) return true
    const grid = new Map<string, number>()
    for (const t of tiles) grid.set(key(t.row, t.col), t.value)

    for (const row of range(size)) {
        for (const col of range(size)) {
            const v = grid.get(key(row, col))
            if (v == null) return true
            const right = col + 1 < size ? grid.get(key(row, col + 1)) : undefined
            const down = row + 1 < size ? grid.get(key(row + 1, col)) : undefined
            if (right === v || down === v) return true
        }
    }
    return false
}

function getLines(size: number, direction: Direction) {
    const lines: Array<Array<{ row: number; col: number }>> = []

    if (direction === 'left' || direction === 'right') {
        for (const row of range(size)) {
            const cols = direction === 'left' ? range(size) : range(size).reverse()
            lines.push(cols.map((col) => ({row, col})))
        }
        return lines
    }

    for (const col of range(size)) {
        const rows = direction === 'up' ? range(size) : range(size).reverse()
        lines.push(rows.map((row) => ({row, col})))
    }

    return lines
}

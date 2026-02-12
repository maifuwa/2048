import type {GameStatus, Tile} from './types'

export interface GameState {
    size: number
    score: number
    best: number
    status: GameStatus
    keepPlaying: boolean
    nextTileId: number
    tiles: Tile[]
}


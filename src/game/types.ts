export type Direction = 'up' | 'down' | 'left' | 'right'

export type GameStatus = 'playing' | 'won' | 'lost'

export type TileId = number

export interface Tile {
  id: TileId
  value: number
  row: number
  col: number
  justSpawned?: boolean
  justMerged?: boolean
}

export interface GameState {
  size: number
  score: number
  best: number
  status: GameStatus
  keepPlaying: boolean
  nextTileId: number
  tiles: Tile[]
}

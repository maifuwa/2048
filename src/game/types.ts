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

export interface GameSnapshot {
  size: number
  score: number
  best: number
  status: GameStatus
  keepPlaying: boolean
  nextTileId: number
  tiles: Array<Pick<Tile, 'id' | 'value' | 'row' | 'col'>>
}


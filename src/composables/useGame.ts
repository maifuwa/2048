import {onMounted, onUnmounted, readonly, shallowRef, watch} from 'vue'
import {clearTransientFlags, createNewGame, move, setKeepPlaying} from '../game/engine'
import type {Direction, GameState} from '../game/types'
import {loadBestScore, saveBestScore} from '../game/storage'

export interface UseGameOptions {
  size?: number
  rng?: () => number
}

const KEY_TO_DIRECTION: Record<string, Direction> = {
  arrowup: 'up',
  w: 'up',
  arrowdown: 'down',
  s: 'down',
  arrowleft: 'left',
  a: 'left',
  arrowright: 'right',
  d: 'right',
}

export function useGame(options: UseGameOptions = {}) {
  const size = options.size ?? 4
  const rng = options.rng ?? Math.random

  const state = shallowRef<GameState>(createNewGame(size, loadBestScore(), rng))
  let clearFlagsRaf: number | null = null

  function scheduleClearFlags() {
    if (clearFlagsRaf != null) cancelAnimationFrame(clearFlagsRaf)
    clearFlagsRaf = requestAnimationFrame(() => {
      state.value = clearTransientFlags(state.value)
      clearFlagsRaf = null
    })
  }

  function newGame() {
    state.value = createNewGame(size, state.value.best, rng, state.value.nextTileId)
    scheduleClearFlags()
  }

  function keepPlaying() {
    state.value = setKeepPlaying(state.value, true)
  }

  function doMove(direction: Direction) {
    const next = move(state.value, direction, rng)
    if (next === state.value) return
    state.value = next
    scheduleClearFlags()
  }

  function handleKeydown(event: KeyboardEvent) {
    const direction = KEY_TO_DIRECTION[event.key.toLowerCase()]
    if (!direction) return
    event.preventDefault()
    doMove(direction)
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown, {passive: false})
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    if (clearFlagsRaf != null) cancelAnimationFrame(clearFlagsRaf)
  })

  watch(() => state.value.best, (nextBest) => saveBestScore(nextBest), {flush: 'post'})

  return {
    state: readonly(state),
    newGame,
    keepPlaying,
    move: doMove,
  }
}

import {computed, onMounted, onUnmounted, readonly, shallowRef, watch} from 'vue'
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

  const state = shallowRef<GameState>(createNewGame(size, 0, rng))
  let clearFlagsRaf: number | null = null

  const tiles = computed(() => state.value.tiles)
  const score = computed(() => state.value.score)
  const best = computed(() => state.value.best)
  const status = computed(() => state.value.status)
  const keepPlayingEnabled = computed(() => state.value.keepPlaying)

  function scheduleClearFlags() {
    if (clearFlagsRaf != null) cancelAnimationFrame(clearFlagsRaf)
    clearFlagsRaf = requestAnimationFrame(() => {
      state.value = clearTransientFlags(state.value)
      clearFlagsRaf = null
    })
  }

  function newGame() {
    state.value = createNewGame(size, state.value.best, rng)
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
    const bestScore = loadBestScore()
    state.value = createNewGame(size, bestScore, rng)
    window.addEventListener('keydown', handleKeydown, {passive: false})
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    if (clearFlagsRaf != null) cancelAnimationFrame(clearFlagsRaf)
  })

  watch(best, (nextBest) => saveBestScore(nextBest), {flush: 'post'})

  return {
    state: readonly(state),
    tiles,
    score,
    best,
    status,
    keepPlayingEnabled,
    newGame,
    keepPlaying,
    move: doMove,
  }
}

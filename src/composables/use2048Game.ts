import { computed, onMounted, onUnmounted, shallowRef, watch } from 'vue'
import { clearTransientFlags, createNewGame, fromSnapshot, move, setKeepPlaying, toSnapshot } from '../game/engine'
import type { Direction } from '../game/types'
import type { GameState } from '../game/state'
import { loadSnapshot, saveSnapshot } from '../game/storage'

export interface Use2048GameOptions {
  size?: number
  rng?: () => number
}

export function use2048Game(options: Use2048GameOptions = {}) {
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

  function doMove(dir: Direction) {
    const next = move(state.value, dir, rng)
    if (next === state.value) return
    state.value = next
    scheduleClearFlags()
  }

  function handleKeydown(e: KeyboardEvent) {
    const key = e.key.toLowerCase()
    if (key === 'arrowup' || key === 'w') {
      e.preventDefault()
      doMove('up')
    } else if (key === 'arrowdown' || key === 's') {
      e.preventDefault()
      doMove('down')
    } else if (key === 'arrowleft' || key === 'a') {
      e.preventDefault()
      doMove('left')
    } else if (key === 'arrowright' || key === 'd') {
      e.preventDefault()
      doMove('right')
    }
  }

  onMounted(() => {
    const snap = loadSnapshot()
    if (snap && snap.size === size) {
      state.value = fromSnapshot(snap)
    } else {
      state.value = createNewGame(size, 0, rng)
    }

    window.addEventListener('keydown', handleKeydown, { passive: false })
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    if (clearFlagsRaf != null) cancelAnimationFrame(clearFlagsRaf)
  })

  watch(
    state,
    (s) => {
      saveSnapshot(toSnapshot(s))
    },
    { flush: 'post' },
  )

  return {
    state,
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


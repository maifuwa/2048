<script lang="ts" setup>
import {computed, onMounted, onUnmounted, useTemplateRef} from 'vue'
import type {Tile} from '@/game/types'
import TileComponent from './Tile.vue'

const props = defineProps<{
  size: number
  tiles: ReadonlyArray<Readonly<Tile>>
}>()

const boardEl = useTemplateRef<HTMLDivElement>('boardEl')
const hasMergedTile = computed(() => props.tiles.some((tile) => tile.justMerged))
let ro: ResizeObserver | null = null

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function readMetrics() {
  if (!boardEl.value) return

  const boardPx = boardEl.value.getBoundingClientRect().width
  // Keep tiles readable on desktop, but allow the board to shrink on small screens.
  let gap = Math.round(clamp(boardPx * 0.03, 6, 16))
  let cell = (boardPx - gap * (props.size + 1)) / props.size

  // If space is extremely tight, trade gap for cell size to avoid overflow.
  if (cell < 24) {
    gap = Math.max(4, Math.floor((boardPx - 24 * props.size) / (props.size + 1)))
    cell = (boardPx - gap * (props.size + 1)) / props.size
  }

  const cellPx = Math.max(1, Math.floor(cell * 100) / 100)
  const gapPx = Math.max(0, gap)

  boardEl.value.style.setProperty('--cell', `${cellPx}px`)
  boardEl.value.style.setProperty('--gap', `${gapPx}px`)
}

function tileStyle(t: Readonly<Tile>) {
  return {
    '--tile-col': String(t.col),
    '--tile-row': String(t.row),
  }
}

onMounted(() => {
  readMetrics()
  if (boardEl.value) {
    ro = new ResizeObserver(() => readMetrics())
    ro.observe(boardEl.value)
  }
})

onUnmounted(() => {
  ro?.disconnect()
  ro = null
})
</script>

<template>
  <div
    ref="boardEl"
    :class="{ 'board-merge-active': hasMergedTile }"
    :style="{ '--size': String(props.size) }"
    class="board"
  >
    <div aria-hidden="true" class="grid">
      <div v-for="n in props.size * props.size" :key="n" class="cell"/>
    </div>

    <div class="tile-layer">
      <TileComponent v-for="t in props.tiles" :key="t.id" :style="tileStyle(t)" :tile="t"/>
    </div>
  </div>
</template>

<style scoped>
.board {
  --size: 4;
  --gap: 16px;
  --cell: 130px;
  --slide-duration: 100ms;
  width: min(100%, 600px, 92vmin);
  margin: 0 auto;
  background: var(--board-bg);
  border-radius: var(--radius);
  padding: var(--gap);
  position: relative;
  user-select: none;
  aspect-ratio: 1;
}

.board-merge-active {
  --slide-duration: 180ms;
}

.grid {
  display: grid;
  grid-template-columns: repeat(var(--size), var(--cell));
  grid-template-rows: repeat(var(--size), var(--cell));
  gap: var(--gap);
}

.cell {
  background: var(--cell-bg);
  border-radius: 3px;
}

.tile-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>

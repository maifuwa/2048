<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, useTemplateRef } from 'vue'
import type { Tile } from '../../game/types'
import TileView from './TileView.vue'

const props = defineProps<{
  size: number
  tiles: Tile[]
}>()

const boardEl = useTemplateRef<HTMLDivElement>('boardEl')

const metrics = shallowRef({ cell: 106, gap: 15 })
let ro: ResizeObserver | null = null

function readMetrics() {
  if (!boardEl.value) return
  const style = getComputedStyle(boardEl.value)
  const cell = Number.parseFloat(style.getPropertyValue('--cell')) || metrics.value.cell
  const gap = Number.parseFloat(style.getPropertyValue('--gap')) || metrics.value.gap
  metrics.value = { cell, gap }
}

function tileStyle(t: Tile) {
  const { cell, gap } = metrics.value
  const x = gap + t.col * (cell + gap)
  const y = gap + t.row * (cell + gap)
  return { transform: `translate(${x}px, ${y}px)` }
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
  <div ref="boardEl" class="board" :style="{ '--size': String(props.size) }">
    <div class="grid" aria-hidden="true">
      <div v-for="n in props.size * props.size" :key="n" class="cell" />
    </div>

    <div class="tile-layer">
      <TileView v-for="t in props.tiles" :key="t.id" :tile="t" :style="tileStyle(t)" />
    </div>
  </div>
</template>

<style scoped>
.board {
  --size: 4;
  width: calc(var(--gap) * (var(--size) + 1) + var(--cell) * var(--size));
  height: calc(var(--gap) * (var(--size) + 1) + var(--cell) * var(--size));
  background: var(--board-bg);
  border-radius: var(--radius);
  padding: var(--gap);
  position: relative;
  user-select: none;
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
}
</style>


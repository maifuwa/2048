<script lang="ts" setup>
import {computed} from 'vue'
import type {Tile} from '@/game/types'

const TILE_COLORS: Record<number, [string, string]> = {
  2: ['#f16528', 'white'],
  4: ['#edd51e', 'black'],
  8: ['#3592cb', 'white'],
  16: ['#f23901', 'white'],
  32: ['#61dafb', '#13252a'],
  64: ['#4f82bf', 'white'],
  128: ['#ff4556', 'white'],
  256: ['#0963a3', 'white'],
  512: ['rgb(255 208 40)', '#261f08'],
  1024: ['rgb(99 108 255)', '#fff'],
  2048: ['#40b883', '#34495e'],
  4096: ['#cb3837', 'white'],
  8192: ['#509640', 'white'],
  16384: ['#2f71ba', 'white'],
}

const props = defineProps<{
  tile: Readonly<Tile>
}>()

const digitClass = computed(() => {
  const v = props.tile.value
  if (v < 100) return 'tile-2d'
  if (v < 1000) return 'tile-3d'
  if (v < 10000) return 'tile-4d'
  return 'tile-5d'
})

const tileColor = computed(() => {
  return TILE_COLORS[props.tile.value] || ['white', 'black']
})

const hasGlow = computed(() => props.tile.value >= 64)
</script>

<template>
  <div
    :class="[
      digitClass,
      { 'tile-spawn': props.tile.justSpawned, 'tile-merge': props.tile.justMerged },
    ]"
    :data-value="props.tile.value"
    :style="{
      backgroundColor: tileColor[0],
      color: tileColor[1],
      boxShadow: hasGlow ? `0 0 10px 0px ${tileColor[0]}` : 'none',
    }"
    class="tile"
  >
    <div class="tile-inner tile-border">
      <span class="tile-text">{{ props.tile.value }}</span>
    </div>
  </div>
</template>

<style scoped>
.tile {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--cell);
  height: var(--cell);
  transform: translate(
    calc(var(--gap) + var(--tile-col, 0) * (var(--cell) + var(--gap))),
    calc(var(--gap) + var(--tile-row, 0) * (var(--cell) + var(--gap)))
  );
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  line-height: 1;
  transition: transform var(--slide-duration, 100ms) ease-in-out;
  will-change: transform;
}

.tile-inner {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tile-border {
  border-bottom: 4px solid rgba(0, 0, 0, 0.1);
  border-right: 4px solid rgba(255, 255, 255, 0.2);
}

.tile-text {
  transform: translateY(-1px);
}

.tile-spawn .tile-inner {
  animation: pop-in 260ms ease-out;
}

.tile-merge .tile-inner {
  animation: pop-merge 300ms ease-out;
}

@keyframes pop-in {
  0% {
    transform: scale(0.7);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pop-merge {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.12);
  }
  100% {
    transform: scale(1);
  }
}

.tile-2d {
  font-size: calc(var(--cell) * 0.42);
}

.tile-3d {
  font-size: calc(var(--cell) * 0.34);
}

.tile-4d {
  font-size: calc(var(--cell) * 0.28);
}

.tile-5d {
  font-size: calc(var(--cell) * 0.22);
}
</style>

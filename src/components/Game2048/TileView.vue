<script setup lang="ts">
import { computed } from 'vue'
import type { Tile } from '../../game/types'

const props = defineProps<{
  tile: Tile
}>()

const digitClass = computed(() => {
  const v = props.tile.value
  if (v < 100) return 'tile-2d'
  if (v < 1000) return 'tile-3d'
  if (v < 10000) return 'tile-4d'
  return 'tile-5d'
})

const valueClass = computed(() => {
  const v = props.tile.value
  if (v <= 16384) return `tile-${v}`
  return 'tile-super'
})

const tileColor = computed(() => {
  const colors: Record<number, [string, string]> = {
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
  return colors[props.tile.value] || ['white', 'black']
})

const hasGlow = computed(() => props.tile.value >= 64)
</script>

<template>
  <div
    class="tile"
    :class="[
      valueClass,
      digitClass,
      { 'tile-spawn': props.tile.justSpawned, 'tile-merge': props.tile.justMerged },
    ]"
    :data-value="props.tile.value"
    :style="{
      'background-color': tileColor[0],
      'color': tileColor[1],
      'box-shadow': hasGlow ? `0 0 10px 0px ${tileColor[0]}` : 'none',
    }"
  >
    <div
      class="tile-inner"
      :class="{ 'tile-border': props.tile.value }"
    >
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
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  line-height: 1;
  transition: transform 100ms ease-in-out;
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
  animation: pop-in 180ms ease-out;
}

.tile-merge .tile-inner {
  animation: pop-merge 200ms ease-out;
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
  font-size: 52px;
}
.tile-3d {
  font-size: 44px;
}
.tile-4d {
  font-size: 36px;
}
.tile-5d {
  font-size: 28px;
}

@media (max-width: 520px) {
  .tile-2d {
    font-size: 44px;
  }
  .tile-3d {
    font-size: 36px;
  }
  .tile-4d {
    font-size: 28px;
  }
  .tile-5d {
    font-size: 22px;
  }
}
</style>

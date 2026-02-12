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
  return v <= 2048 ? `tile-${v}` : 'tile-super'
})
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
  >
    <div class="tile-inner">
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
  transition: transform 120ms ease-in-out;
  will-change: transform;
}

.tile-inner {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.12);
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

.tile-2,
.tile-4 {
  color: var(--text);
}

.tile-8,
.tile-16,
.tile-32,
.tile-64,
.tile-128,
.tile-256,
.tile-512,
.tile-1024,
.tile-2048,
.tile-super {
  color: #f9f6f2;
}

.tile-2 {
  background: #eee4da;
}
.tile-4 {
  background: #ede0c8;
}
.tile-8 {
  background: #f2b179;
}
.tile-16 {
  background: #f59563;
}
.tile-32 {
  background: #f67c5f;
}
.tile-64 {
  background: #f65e3b;
}
.tile-128 {
  background: #edcf72;
}
.tile-256 {
  background: #edcc61;
}
.tile-512 {
  background: #edc850;
}
.tile-1024 {
  background: #edc53f;
}
.tile-2048 {
  background: #edc22e;
}

.tile-super {
  background: #3c3a32;
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

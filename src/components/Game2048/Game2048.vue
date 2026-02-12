<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { use2048Game } from '@/composables/use2048Game.ts'
import type { Direction } from '@/game/types.ts'
import GameBoard from './GameBoard.vue'
import GameHeader from './GameHeader.vue'

const game = use2048Game({ size: 4 })

const boardRef = useTemplateRef<HTMLDivElement>('board')
const isOverlayVisible = computed(() => game.status.value !== 'playing')

type Drag = {
  pointerId: number
  startX: number
  startY: number
  active: boolean
}

let drag: Drag | null = null

function directionFromDelta(dx: number, dy: number): Direction | null {
  const absX = Math.abs(dx)
  const absY = Math.abs(dy)
  const threshold = 26
  if (Math.max(absX, absY) < threshold) return null
  if (absX > absY) return dx > 0 ? 'right' : 'left'
  return dy > 0 ? 'down' : 'up'
}

function onPointerDown(e: PointerEvent) {
  if (!boardRef.value) return
  ;(e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId)
  drag = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, active: true }
}

function onPointerUp(e: PointerEvent) {
  if (!drag || !drag.active || e.pointerId !== drag.pointerId) return
  drag.active = false
  const dx = e.clientX - drag.startX
  const dy = e.clientY - drag.startY
  const dir = directionFromDelta(dx, dy)
  drag = null
  if (!dir) return
  game.move(dir)
}
</script>

<template>
  <section class="game">
    <GameHeader :score="game.score.value" :best="game.best.value" @new-game="game.newGame" />

    <p class="subtitle">
      合并相同数字，得到 <strong>2048</strong>。
      <span class="subtitle-hint">键盘方向键/WASD，或滑动操作。</span>
    </p>

    <div
      ref="board"
      class="board-wrap"
      :class="{ 'board-wrap-overlay': isOverlayVisible }"
      role="application"
      aria-label="2048 game board"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <GameBoard :size="game.state.value.size" :tiles="game.tiles.value" />

      <div v-if="game.status.value !== 'playing'" class="overlay" aria-live="polite">
        <div class="overlay-card">
          <p class="overlay-title">
            {{ game.status.value === 'won' ? 'You win!' : 'Game over!' }}
          </p>
          <div class="overlay-actions">
            <button class="btn" type="button" @click="game.newGame">Try again</button>
            <button
              v-if="game.status.value === 'won' && !game.keepPlayingEnabled.value"
              class="btn btn-secondary"
              type="button"
              @click="game.keepPlaying"
            >
              Keep going
            </button>
          </div>
        </div>
      </div>
    </div>

    <p class="meta">
      <span class="meta-strong">规则</span>：每次滑动后会随机生成一个新数字。相同数字相撞会合并并加分。
    </p>
  </section>
</template>

<style scoped>
.game {
  width: min(520px, 100%);
}

.subtitle {
  margin: 0 0 14px;
  color: var(--muted-text);
  font-size: 16px;
}

.subtitle-hint {
  display: inline-block;
  margin-left: 6px;
  opacity: 0.85;
}

.board-wrap {
  position: relative;
  border-radius: var(--radius);
  touch-action: none;
}

.overlay {
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(238, 228, 218, 0.73);
}

.overlay-card {
  text-align: center;
  padding: 18px 14px;
}

.overlay-title {
  margin: 0 0 12px;
  font-size: 44px;
  font-weight: 700;
  color: var(--text);
}

.overlay-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  border: 0;
  cursor: pointer;
  background: var(--btn-bg);
  color: var(--btn-text);
  padding: 10px 14px;
  border-radius: 3px;
  font-weight: 700;
  font-size: 16px;
}

.btn:active {
  transform: translateY(1px);
}

.btn-secondary {
  background: #6b5b4a;
}

.meta {
  margin: 16px 0 0;
  color: var(--muted-text);
  font-size: 14px;
}

.meta-strong {
  font-weight: 800;
}
</style>


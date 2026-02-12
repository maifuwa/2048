<script lang="ts" setup>
import {computed, useTemplateRef} from 'vue'
import {use2048Game} from '@/composables/use2048Game.ts'
import type {Direction} from '@/game/types.ts'
import GameBoard from './GameBoard.vue'
import GameHeader from './GameHeader.vue'

const game = use2048Game({size: 4})

const boardRef = useTemplateRef<HTMLDivElement>('board')
computed(() => game.status.value !== 'playing');

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
      ;
  (e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId)
  drag = {pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, active: true}
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
    <GameHeader :best="game.best.value" :score="game.score.value" @new-game="game.newGame"/>

    <div
        ref="board"
        aria-label="2048 game board"
        class="board-wrap"
        role="application"
        @pointercancel="onPointerUp"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
    >
      <GameBoard :size="game.state.value.size" :tiles="game.tiles.value"/>

      <div v-if="game.status.value === 'lost'" aria-live="polite" class="overlay">
        <div class="overlay-card">
          <p class="overlay-title">
            You Lose
          </p>
          <button class="btn" type="button" @click="game.newGame">Play Again</button>
        </div>
      </div>

      <div v-if="game.status.value === 'won'" aria-live="polite" class="overlay">
        <div class="overlay-card">
          <p class="overlay-title">
            You Won!
          </p>
          <div class="overlay-actions">
            <button
                v-if="!game.keepPlayingEnabled.value"
                class="btn btn-secondary"
                type="button"
                @click="game.keepPlaying"
            >
              Continue
            </button>
            <button class="btn" type="button" @click="game.newGame">Play Again</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.game {
  width: 100%;
  max-width: 600px;
  display: grid;
  gap: 16px;
}

.board-wrap {
  position: relative;
  border-radius: var(--radius);
  touch-action: none;
  width: 100%;
}

.overlay {
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(47, 47, 47, 0.85);
  z-index: 10;
}

.overlay-card {
  text-align: center;
  padding: 18px 14px;
}

.overlay-title {
  margin: 0 0 16px;
  font-size: clamp(34px, 9vw, 48px);
  font-weight: 900;
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
  padding: 10px 16px;
  border-radius: 3px;
  font-weight: 700;
  font-size: 16px;
}

.btn:hover {
  opacity: 0.9;
}

.btn:active {
  transform: translateY(1px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
}
</style>

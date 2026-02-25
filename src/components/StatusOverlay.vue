<script lang="ts" setup>
import type {GameStatus} from '@/game/types'

const props = defineProps<{
  status: GameStatus
  keepPlayingEnabled: boolean
}>()

const emit = defineEmits<{
  newGame: []
  keepPlaying: []
}>()
</script>

<template>
  <div v-if="props.status !== 'playing'" aria-live="polite" class="overlay">
    <div class="overlay-card">
      <p class="overlay-title">
        {{ props.status === 'won' ? 'You Won!' : 'You Lose' }}
      </p>

      <div class="overlay-actions">
        <button
          v-if="props.status === 'won' && !props.keepPlayingEnabled"
          class="btn btn-secondary"
          type="button"
          @click="emit('keepPlaying')"
        >
          Continue
        </button>
        <button class="btn" type="button" @click="emit('newGame')">Play Again</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

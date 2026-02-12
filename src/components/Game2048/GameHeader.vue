<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  score: number
  best: number
}>()

const emit = defineEmits<{
  newGame: []
}>()

// Smooth score transition
const displayScore = computed(() => props.score)
</script>

<template>
  <header class="header">
    <div class="left">
      <div class="score-display">
        {{ displayScore }}
      </div>
      <div class="score-label">
        Score
      </div>
      <div class="subtitle">
        Join the tiles, get to 2048!
      </div>
    </div>

    <div class="spacer" />

    <div class="right">
      <div class="best-box">
        <div class="best-value">
          {{ best }}
        </div>
        <div class="best-label">
          High Score
        </div>
      </div>
      <button class="new-game" type="button" @click="emit('newGame')">New Game</button>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 16px;
  max-width: 600px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.left {
  text-align: left;
  align-self: flex-end;
  flex: 1;
}

.score-display {
  font-size: 80px;
  font-weight: 900;
  font-family: 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1;
  letter-spacing: -2px;
}

.score-label {
  font-size: 30px;
  font-family: 'Courier New', monospace;
  opacity: 0.5;
  margin-top: 4px;
}

.subtitle {
  opacity: 0.5;
  font-size: 14px;
  margin-top: 4px;
}

.spacer {
  display: none;
}

.right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  min-width: fit-content;
}

.best-box {
  text-align: right;
  opacity: 0.5;
  font-weight: 500;
  font-family: 'Courier New', monospace;
}

.best-value {
  font-size: 30px;
}

.best-label {
  font-size: 16px;
  opacity: 0.7;
}

.new-game {
  border: 0;
  cursor: pointer;
  background: var(--btn-bg);
  color: var(--btn-text);
  padding: 10px 16px;
  border-radius: 3px;
  font-weight: 800;
  font-size: 16px;
}

.new-game:hover {
  opacity: 0.9;
}

.new-game:active {
  transform: translateY(1px);
}

@media (max-width: 520px) {
  .score-display {
    font-size: 64px;
  }
  .score-label {
    font-size: 24px;
  }
  .best-value {
    font-size: 24px;
  }
}
</style>


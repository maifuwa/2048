<script lang="ts" setup>
const props = defineProps<{
  score: number
  best: number
}>()

const emit = defineEmits<{
  newGame: []
}>()
</script>

<template>
  <header class="header">
    <div class="score">
      <div class="score-display">
        {{ props.score }}
      </div>
      <div class="score-label">
        Score
      </div>
    </div>

    <div class="actions">
      <div class="best-box">
        <div class="best-value">
          {{ props.best }}
        </div>
        <div class="best-label">
          High Score
        </div>
      </div>
      <button class="new-game" type="button" @click="emit('newGame')">New Game</button>
    </div>

    <div class="subtitle">
      Join the tiles, get to 2048!
    </div>
  </header>
</template>

<style scoped>
.header {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "score actions"
    "subtitle actions";
  gap: 10px 14px;
  align-items: end;
  width: 100%;
}

.score {
  grid-area: score;
  text-align: left;
}

.score-display {
  font-size: clamp(56px, 10vw, 80px);
  font-weight: 900;
  font-family: 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1;
  letter-spacing: -2px;
}

.score-label {
  font-size: clamp(20px, 4.3vw, 30px);
  font-family: 'Courier New', monospace;
  opacity: 0.5;
  margin-top: 4px;
}

.subtitle {
  grid-area: subtitle;
  opacity: 0.5;
  font-size: 14px;
  line-height: 1.3;
}

.actions {
  grid-area: actions;
  display: grid;
  gap: 10px;
  justify-items: end;
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

@media (max-width: 420px) {
  .header {
    grid-template-columns: 1fr;
    grid-template-areas:
      "score"
      "actions"
      "subtitle";
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .best-box {
    text-align: left;
  }

  .best-value {
    font-size: 24px;
  }
}
</style>

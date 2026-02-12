<script setup lang="ts">
defineProps<{
  score: number
  best: number
}>()

const emit = defineEmits<{
  newGame: []
}>()
</script>

<template>
  <header class="header">
    <div class="title">
      <h1 class="title-text">2048</h1>
    </div>

    <div class="right">
      <div class="scores" aria-label="scores">
        <div class="score-box" aria-label="score">
          <div class="score-label">SCORE</div>
          <div class="score-value">{{ score }}</div>
        </div>
        <div class="score-box" aria-label="best score">
          <div class="score-label">BEST</div>
          <div class="score-value">{{ best }}</div>
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
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.title-text {
  margin: 0;
  font-size: 80px;
  letter-spacing: -1px;
  line-height: 1;
}

.right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.scores {
  display: flex;
  gap: 8px;
}

.score-box {
  min-width: 92px;
  padding: 10px 12px 8px;
  border-radius: 3px;
  background: var(--board-bg);
  color: #fff;
  text-align: center;
}

.score-label {
  font-size: 12px;
  font-weight: 800;
  opacity: 0.85;
  letter-spacing: 0.3px;
}

.score-value {
  font-size: 22px;
  font-weight: 800;
  margin-top: 2px;
}

.new-game {
  border: 0;
  cursor: pointer;
  background: var(--btn-bg);
  color: var(--btn-text);
  padding: 10px 12px;
  border-radius: 3px;
  font-weight: 800;
  font-size: 16px;
}

.new-game:active {
  transform: translateY(1px);
}

@media (max-width: 520px) {
  .title-text {
    font-size: 64px;
  }
  .score-box {
    min-width: 84px;
  }
}
</style>


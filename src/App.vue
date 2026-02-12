<script lang="ts" setup>
import Game2048 from './components/Game2048/Game2048.vue'
</script>

<template>
  <main class="app">
    <Game2048/>
  </main>
</template>

<style scoped>
.app {
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 40px 16px 56px;
}

@media (max-width: 520px) {
  .app {
    padding: 24px 12px 32px;
    place-items: start center;
  }
}
</style>

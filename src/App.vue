<script lang="ts" setup>
import Game from './components/Game.vue'
</script>

<template>
  <main class="app">
    <Game/>
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

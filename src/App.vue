<script setup lang="ts">
import Game2048 from './components/Game2048/Game2048.vue'
</script>

<template>
  <main class="app">
    <Game2048 />
  </main>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 16px 56px;
}
</style>

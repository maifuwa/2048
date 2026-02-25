<script lang="ts" setup>
import {useGame} from '@/composables/useGame'
import {useSwipe} from '@/composables/useSwipe'
import Board from './Board.vue'
import Header from './Header.vue'
import StatusOverlay from './StatusOverlay.vue'

const {
  state,
  move,
  keepPlaying,
  newGame,
} = useGame({size: 4})

const {onPointerDown, onPointerUp, onPointerCancel} = useSwipe({onSwipe: move})
</script>

<template>
  <section class="game">
    <Header :best="state.best" :score="state.score" @new-game="newGame"/>

    <div
      aria-label="2048 game board"
      class="board-wrap"
      role="application"
      @pointercancel="onPointerCancel"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
    >
      <Board :size="state.size" :tiles="state.tiles"/>
      <StatusOverlay
        :keep-playing-enabled="state.keepPlaying"
        :status="state.status"
        @keep-playing="keepPlaying"
        @new-game="newGame"
      />
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
</style>

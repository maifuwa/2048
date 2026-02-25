<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import SakanaWidget from 'sakana-widget'
import 'sakana-widget/lib/index.css'

const props = withDefaults(defineProps<{
  side: 'left' | 'right'
  character?: string
}>(), {
  character: 'takina',
})

const widgetHost = useTemplateRef<HTMLDivElement>('widgetHost')
let widget: SakanaWidget | null = null

onMounted(() => {
  if (!widgetHost.value) return

  widget = new SakanaWidget({
    autoFit: true,
    character: props.character,
    controls: false,
  }).mount(widgetHost.value)
})

onBeforeUnmount(() => {
  widget?.unmount()
  widget = null
})
</script>

<template>
  <div
    ref="widgetHost"
    :class="['sakana-widget-host', `sakana-widget-host--${props.side}`]"
    aria-label="Sakana Widget"
  />
</template>

<style scoped>
.sakana-widget-host {
  position: fixed;
  bottom: calc(10px + env(safe-area-inset-bottom));
  width: min(180px, 42vw);
  aspect-ratio: 1 / 1;
  z-index: 12;
}

.sakana-widget-host--left {
  left: calc(12px + env(safe-area-inset-left));
}

.sakana-widget-host--right {
  right: calc(12px + env(safe-area-inset-right));
}

@media (max-width: 520px) {
  .sakana-widget-host {
    width: min(150px, 44vw);
    bottom: calc(8px + env(safe-area-inset-bottom));
  }

  .sakana-widget-host--left {
    left: calc(8px + env(safe-area-inset-left));
  }

  .sakana-widget-host--right {
    right: calc(8px + env(safe-area-inset-right));
  }
}
</style>

import type {Direction} from '@/game/types'

interface SwipeDrag {
  pointerId: number
  startX: number
  startY: number
}

interface UseSwipeDirectionOptions {
  onSwipe: (direction: Direction) => void
  threshold?: number
}

const INTERACTIVE_TARGET_SELECTOR = [
  'button',
  'a',
  'input',
  'textarea',
  'select',
  'label',
  '[role="button"]',
].join(', ')

export function useSwipe(options: UseSwipeDirectionOptions) {
  const threshold = options.threshold ?? 26
  let drag: SwipeDrag | null = null

  function isInteractiveTarget(target: EventTarget | null) {
    if (!(target instanceof Element)) return false
    return target.closest(INTERACTIVE_TARGET_SELECTOR) !== null
  }

  function directionFromDelta(dx: number, dy: number): Direction | null {
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    if (Math.max(absX, absY) < threshold) return null
    if (absX > absY) return dx > 0 ? 'right' : 'left'
    return dy > 0 ? 'down' : 'up'
  }

  function onPointerDown(event: PointerEvent) {
    if (isInteractiveTarget(event.target)) {
      drag = null
      return
    }

    const target = event.currentTarget as HTMLElement | null
    target?.setPointerCapture?.(event.pointerId)
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    }
  }

  function onPointerCancel(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return
    drag = null
  }

  function onPointerUp(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return

    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    drag = null

    const direction = directionFromDelta(dx, dy)
    if (!direction) return
    options.onSwipe(direction)
  }

  return {
    onPointerDown,
    onPointerUp,
    onPointerCancel,
  }
}

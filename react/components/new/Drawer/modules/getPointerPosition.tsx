function isMouseEvent(event: TouchEvent | MouseEvent): event is MouseEvent {
  return !!(event as MouseEvent).clientX
}

function isTouchEvent(event: TouchEvent | MouseEvent): event is TouchEvent {
  const touches = (event as TouchEvent).touches
  if (!touches) return false
  return touches.length > 0
}

export default function getPointerPosition(event: TouchEvent | MouseEvent) {
  if (isMouseEvent(event)) {
    return {
      x: event.clientX,
      y: event.clientY,
      source: 'mouse',
      timeStamp: event.timeStamp,
    }
  }

  if (!isTouchEvent(event)) {
    return null
  }

  const touch = event.touches[0]

  return {
    x: touch.clientX,
    y: touch.clientY,
    source: 'touch',
    timeStamp: event.timeStamp,
  }
}

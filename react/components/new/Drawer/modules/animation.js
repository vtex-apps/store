import parseMeasure from './parseMeasure'

const animations = []

const createAnimation = ({ object, prop, stop, isStopped }) => ({
  object,
  prop,
  stop,
  isStopped,
})

const stopConflictingAnimations = animation =>
  animations.filter(cur => {
    const isConflicting =
      cur.object === animation.object && cur.prop === animation.prop
    if (isConflicting) {
      cur.stop()
    }
    return !cur.isStopped()
  })

function animate({
  object,
  prop,
  target,
  duration,
  speed,
  acceleration,
  maxSpeed,
  onUpdate = null,
  onComplete = null,
}) {
  const targetFps = 60
  const frameDuration = 1000 / targetFps

  const [targetValue, targetUnit, isTargetUnitless] = parseMeasure(target)
  const [originValue, originUnit] = parseMeasure(object[prop])
  const unit = isTargetUnitless ? originUnit : targetUnit
  const delta = targetValue - originValue

  const ease = v => v * (2 - v)
  const maxTimeMultiplier = 2

  let stopped = false

  const stop = () => {
    stopped = true
  }
  const isStopped = () => {
    stopped
  }

  let current = duration ? 0 : originValue
  let last = null

  const update = now => {
    if (stopped) return
    let timeMultiplier = 1
    if (last != null) {
      const deltaTime = now - last
      timeMultiplier = deltaTime / frameDuration
      if (timeMultiplier > maxTimeMultiplier) timeMultiplier = maxTimeMultiplier
    }
    last = now

    if (duration) {
      const step = frameDuration / (duration * 1000)
      current += step * timeMultiplier
      if (current >= 1) {
        current = 1
        if (onComplete != null) {
          onComplete()
        }
        stop()
      }

      const value = `${originValue + ease(current) * delta}${unit}`

      object[prop] = value

      if (onUpdate != null) {
        onUpdate(value)
      }
    } else if (speed) {
      current += speed / (targetFps * timeMultiplier)

      if (acceleration) {
        speed *= acceleration
      }

      if (maxSpeed && speed > maxSpeed) {
        speed = maxSpeed
      }

      if (
        (speed > 0 && current >= targetValue) ||
        (speed < 0 && current <= targetValue)
      ) {
        current = targetValue
        if (onComplete != null) {
          onComplete()
        }
        stop()
      }
      const formattedValue = `${current}${unit}`
      object[prop] = formattedValue

      if (onUpdate != null) {
        onUpdate(formattedValue)
      }
    }

    requestAnimationFrame(update)
  }
  update()

  const animation = createAnimation({ object, prop, stop, isStopped })
  stopConflictingAnimations(animation)

  animations.push(animation)

  return stop
}

export { animate }

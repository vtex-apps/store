export function setStyle(target, styles) {
  Object.keys(styles).forEach(attr => {
    target.style[attr] = styles[attr]
  })
}

function getZeroOrString(num = 0) {
  return num === 0 ? num : `${num}%`
}

export function getTranslateProperty(x = 0, y = 0, z = 0) {
  return {
    transform: `translate3d(${getZeroOrString(x)}, ${getZeroOrString(
      y
    )}, ${getZeroOrString(z)})`,
    WebkitTransform: `translate3d(${getZeroOrString(x)}, ${getZeroOrString(
      y
    )}, ${getZeroOrString(z)})`,
  }
}

export function getStylingTransition(easing, duration = 0) {
  return {
    WebkitTransition: `all ${duration}ms ${easing}`,
    transition: `all ${duration}ms ${easing}`,
  }
}

export const constants = {
  defaultResizeDebounce: 250,
  defaultTransitionDuration: 250,
  NAVIGATION_PAGE: 'page',
}

export const useCssHandles = input =>
  input.reduce((acc, cur) => {
    acc[cur] = cur
    return acc
  }, {})

export const applyModifiers = (input, modifier) => input

export const useResponsiveValues = input =>
  Object.keys(input).reduce((acc, cur) => {
    const value = input[cur]
    acc[cur] = (value && value.desktop) || value
    return acc
  }, {})

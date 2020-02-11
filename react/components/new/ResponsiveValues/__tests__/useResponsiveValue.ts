import {
  useResponsiveValue,
  useResponsiveValues,
} from '../hooks/useResponsiveValue'

/**  TODO: useDevice always returns 'desktop'
 * Multiple devices test cases should be tested */

describe('useResponsiveValue', () => {
  it('should return a single value for the current device', () => {
    const input = {
      desktop: 1,
      mobile: 2,
    }

    const value = useResponsiveValue(input)

    expect(value).toBe(1)
  })

  it('should return a single value if the input is also a single value', () => {
    const input = 1

    const value = useResponsiveValue(input)

    expect(value).toBe(1)
  })
})

describe('useResponsiveValues', () => {
  it('should return the correct values for different keys', () => {
    const input = {
      first: {
        desktop: 1,
        mobile: 2,
      },
      second: {
        desktop: 3,
        mobile: 4,
      },
    }

    const { first, second } = useResponsiveValues(input)

    expect(first).toBe(1)
    expect(second).toBe(3)
  })
})

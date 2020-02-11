import { parseBorders } from '../modules/valuesParser'

describe('parseBorders', () => {
  it('should work with border as array', () => {
    const input = {
      border: ['left', 'bottom', 'right', 'top', 'all'],
      borderWidth: 1,
      borderColor: 'red',
    }

    const border = parseBorders(input)

    expect(border).toBe('bl bb br bt ba bw1 b--red')
  })
  it('should work with border as string', () => {
    const input = {
      border: 'all',
      borderWidth: 1,
      borderColor: 'red',
    }

    const border = parseBorders(input)

    expect(border).toBe('ba bw1 b--red')
  })
})

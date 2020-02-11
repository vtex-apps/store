import {
  getSubset,
  getShape,
  getOrientation,
  getState,
  getType,
} from '../utils/helpers'
import { SHAPES, ORIENTATIONS } from '../utils/enhancements'

describe('Enhancements', () => {
  it('should allow supported enhancements', () => {
    const shapes = getSubset('square', SHAPES)
    const orientations = getSubset('down, right', ORIENTATIONS)

    expect(shapes).toEqual([
      {
        id: 'square',
        modifier: 'br1',
      },
    ])

    expect(orientations).toEqual([
      {
        id: 'down',
        modifier: '--down',
      },
      {
        id: 'right',
        modifier: '--right',
      },
    ])
  })

  it('should get the correct shape', () => {
    const square = getShape(16, 'red', 'square')
    const rounded = getShape(20, 'green', 'rounded')
    const circle = getShape(24, 'blue', 'circle')

    expect(square.reducedIconSize).toBeLessThan(16)
    expect(rounded.reducedIconSize).toBeLessThan(20)
    expect(circle.reducedIconSize).toBeLessThan(24)

    expect(square.wrapperProps).toHaveLength(2)
    expect(rounded.wrapperProps).toHaveLength(2)
    expect(circle.wrapperProps).toHaveLength(2)

    expect(square.wrapperProps[0].className).toContain('br1')
    expect(rounded.wrapperProps[0].className).toContain('br3')
    expect(circle.wrapperProps[0].className).toContain('br-100')

    expect(square.wrapperProps[1].style!.backgroundColor).toEqual('red')
    expect(rounded.wrapperProps[1].style!.backgroundColor).toEqual('green')
    expect(circle.wrapperProps[1].style!.backgroundColor).toEqual('blue')
  })

  it('should get the correct orientation', () => {
    const up = getOrientation('up')
    const down = getOrientation('down')
    const left = getOrientation('left')
    const right = getOrientation('right')

    expect(up).toEqual('--up')
    expect(down).toEqual('--down')
    expect(left).toEqual('--left')
    expect(right).toEqual('--right')
  })

  it('should get the correct state', () => {
    const on = getState('on')
    const off = getState('off')

    expect(on).toEqual('--on')
    expect(off).toEqual('--off')
  })

  it('should get the correct type', () => {
    const filled = getType('filled')
    const outline = getType('outline')
    const line = getType('line')

    expect(filled).toEqual('--filled')
    expect(outline).toEqual('--outline')
    expect(line).toEqual('--line')
  })
})

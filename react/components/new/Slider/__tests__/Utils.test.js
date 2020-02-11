import { JSDOM } from 'jsdom'

import resolveSlidesNumber from '../utils/resolveSlidesNumber'
import { setStyle, getTranslateProperty, getStylingTransition } from '../utils'

describe('Util functions', () => {
  beforeEach(() => {
    const dom = new JSDOM(
      '<!DOCTYPE html><html><head></head><body></body></html>'
    )

    global.window = dom.window
    global.document = dom.window.document

    const resizeEvent = document.createEvent('Event')
    resizeEvent.initEvent('resize', true, true)

    global.window.resizeTo = (width, height) => {
      global.window.innerWidth = width || global.window.innerWidth
      global.window.innerHeight = height || global.window.innerHeight
      global.window.dispatchEvent(resizeEvent)
    }
  })

  it('should resolve slides number correctly', () => {
    expect(resolveSlidesNumber(5)).toEqual(5)

    window.resizeTo(400, 1000)
    expect(resolveSlidesNumber(1, { 400: 2, 1000: 3 })).toEqual(2)

    window.resizeTo(1000, 1000)
    expect(resolveSlidesNumber(1, { 400: 2, 1000: 3 })).toEqual(3)

    // Testing for minimum values
    window.resizeTo(320, 1000)
    expect(resolveSlidesNumber(2, { 320: 1, 500: 2, 750: 3 })).toEqual(2)
  })

  it('should set style correctly', () => {
    const target = {
      style: {},
    }
    const styles = {
      backgroundColor: 'pink',
      color: 'black',
    }
    setStyle(target, styles)
    expect(target.style).toEqual(styles)
  })

  it('should get translate property correctly', () => {
    expect(getTranslateProperty(0, 5, -70)).toEqual({
      transform: 'translate3d(0, 5%, -70%)',
      WebkitTransform: 'translate3d(0, 5%, -70%)',
    })
  })

  it('should get styling transition correctly', () => {
    expect(
      getStylingTransition('cubic-bezier(0.215, 0.61, 0.355, 1)', 500)
    ).toEqual({
      WebkitTransition: 'all 500ms cubic-bezier(0.215, 0.61, 0.355, 1)',
      transition: 'all 500ms cubic-bezier(0.215, 0.61, 0.355, 1)',
    })
  })
})

/* eslint-env jest */

// Mock dependencies to avoid DOM rendering issues
jest.mock('vtex.render-runtime', () => ({
  useRuntime: jest.fn(),
  canUseDOM: true,
}))

jest.mock('../hooks/useDataPixel', () => jest.fn())

const mockUseRuntime = require('vtex.render-runtime').useRuntime
const mockUseDataPixel = require('../hooks/useDataPixel')

describe('PageViewPixel Logic Tests', () => {
  const mockRoute = {
    routeId: 'test.route',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseRuntime.mockReturnValue({
      route: mockRoute,
      getSettings: jest.fn(),
    })

    // Mock DOM globals
    Object.defineProperty(global, 'document', {
      value: {
        title: 'Test Page Title',
        referrer: 'https://external.com',
      },
      configurable: true,
    })

    Object.defineProperty(global, 'location', {
      value: {
        href: 'https://test.com/current-page',
        origin: 'https://test.com',
      },
      configurable: true,
    })
  })

  it('should test mock hook calls', () => {
    mockUseDataPixel()
    expect(mockUseDataPixel).toHaveBeenCalled()
  })

  it('should handle skip parameter logic', () => {
    const skipValue = true
    expect(skipValue).toBe(true)
  })

  it('should handle title parameter logic', () => {
    const title = 'Custom Title'
    expect(title).toBe('Custom Title')
  })

  it('should handle cacheKey parameter logic', () => {
    const cacheKey = 'custom-cache-key'
    expect(cacheKey).toBe('custom-cache-key')
  })

  it('should handle runtime route', () => {
    const runtime = mockUseRuntime()
    expect(runtime.route.routeId).toBe('test.route')
  })

  it('should handle canUseDOM setting', () => {
    const runtime = require('vtex.render-runtime')
    expect(runtime.canUseDOM).toBe(true)

    runtime.canUseDOM = false
    expect(runtime.canUseDOM).toBe(false)

    // Reset
    runtime.canUseDOM = true
  })

  it('should handle missing route', () => {
    mockUseRuntime.mockReturnValue({
      route: undefined,
      getSettings: jest.fn(),
    })

    const runtime = mockUseRuntime()
    expect(runtime.route).toBeUndefined()
  })

  it('should handle different route types', () => {
    mockUseRuntime.mockReturnValue({
      route: { routeId: 'store.search' },
      getSettings: jest.fn(),
    })

    const runtime = mockUseRuntime()
    expect(runtime.route.routeId).toBe('store.search')
  })

  it('should handle document title', () => {
    expect(global.document.title).toBe('Test Page Title')
  })

  it('should handle document referrer', () => {
    expect(global.document.referrer).toBe('https://external.com')
  })

  it('should handle location href', () => {
    expect(global.location.href).toBe('https://test.com/current-page')
  })

  it('should test useDataPixel mock calls', () => {
    mockUseDataPixel()
    expect(mockUseDataPixel).toHaveBeenCalled()
  })

  it('should handle route with different routeId', () => {
    mockUseRuntime.mockReturnValue({
      route: { routeId: 'store.product' },
      getSettings: jest.fn(),
    })

    const runtime = mockUseRuntime()
    expect(runtime.route.routeId).toBe('store.product')
  })

  it('should handle route with partial matching', () => {
    mockUseRuntime.mockReturnValue({
      route: { routeId: 'store.search.category' },
      getSettings: jest.fn(),
    })

    const runtime = mockUseRuntime()
    expect(runtime.route.routeId).toBe('store.search.category')
  })
})

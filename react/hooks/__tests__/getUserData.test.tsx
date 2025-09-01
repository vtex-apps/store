/* eslint-env jest */
import { getUserData, getSessionPromiseFromWindow, SessionResponse } from '../getUserData'

// Mock window object
const mockWindow = {
  __RENDER_8_SESSION__: {
    sessionPromise: Promise.resolve({ test: 'data' }),
  },
}

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true,
})

describe('getUserData function', () => {
  it('should extract user data from profile fields correctly', () => {
    const profileFields: SessionResponse['response']['namespaces']['profile'] = {
      firstName: { value: 'John' },
      lastName: { value: 'Doe' },
      email: { value: 'john.doe@example.com' },
      id: { value: 'user123' },
      phone: { value: '+1234567890' },
      document: { value: '123456789' },
      isAuthenticated: { value: 'true' },
    }

    const result = getUserData(profileFields)

    expect(result).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      id: 'user123',
      phone: '+1234567890',
      document: '123456789',
      isAuthenticated: true,
    })
  })

  it('should handle missing profile fields gracefully', () => {
    const result = getUserData(null)
    expect(result).toEqual({})

    const result2 = getUserData(undefined)
    expect(result2).toEqual({})
  })

  it('should convert isAuthenticated string to boolean', () => {
    const profileFields: SessionResponse['response']['namespaces']['profile'] = {
      isAuthenticated: { value: 'true' },
    }

    const result = getUserData(profileFields)
    expect(result.isAuthenticated).toBe(true)

    const profileFields2: SessionResponse['response']['namespaces']['profile'] = {
      isAuthenticated: { value: 'false' },
    }

    const result2 = getUserData(profileFields2)
    expect(result2.isAuthenticated).toBe(false)

    const profileFields3: SessionResponse['response']['namespaces']['profile'] = {
      isAuthenticated: { value: 'TRUE' },
    }

    const result3 = getUserData(profileFields3)
    expect(result3.isAuthenticated).toBe(true)
  })

  it('should handle partial profile data', () => {
    const profileFields: SessionResponse['response']['namespaces']['profile'] = {
      firstName: { value: 'John' },
      email: { value: 'john@example.com' },
      // Missing other fields
    }

    const result = getUserData(profileFields)

    expect(result).toEqual({
      firstName: 'John',
      email: 'john@example.com',
    })
  })

  it('should ignore fields with empty values', () => {
    const profileFields: SessionResponse['response']['namespaces']['profile'] = {
      firstName: { value: 'John' },
      lastName: { value: '' }, // Empty value should be ignored
      email: { value: 'john@example.com' },
    }

    const result = getUserData(profileFields)

    expect(result).toEqual({
      firstName: 'John',
      email: 'john@example.com',
    })
  })

  it('should handle fields with undefined values', () => {
    const profileFields: SessionResponse['response']['namespaces']['profile'] = {
      firstName: { value: 'John' },
      lastName: undefined,
      email: { value: 'john@example.com' },
    }

    const result = getUserData(profileFields)

    expect(result).toEqual({
      firstName: 'John',
      email: 'john@example.com',
    })
  })
})

describe('getSessionPromiseFromWindow function', () => {
  beforeEach(() => {
    // Reset window mock
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    })
  })

  it('should get session promise from window correctly', () => {
    const result = getSessionPromiseFromWindow()
    expect(result).toBe(mockWindow.__RENDER_8_SESSION__.sessionPromise)
  })

  it('should return resolved null when no session exists', () => {
    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
    })

    const result = getSessionPromiseFromWindow()
    expect(result).resolves.toBeNull()
  })

  it('should return resolved null when session promise is missing', () => {
    Object.defineProperty(global, 'window', {
      value: {
        __RENDER_8_SESSION__: {},
      },
      writable: true,
    })

    const result = getSessionPromiseFromWindow()
    expect(result).resolves.toBeNull()
  })

  it('should return resolved null when __RENDER_8_SESSION__ is null', () => {
    Object.defineProperty(global, 'window', {
      value: {
        __RENDER_8_SESSION__: null,
      },
      writable: true,
    })

    const result = getSessionPromiseFromWindow()
    expect(result).resolves.toBeNull()
  })
})
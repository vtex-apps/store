/* eslint-env jest */
import React from 'react'
import { render, waitFor } from '@vtex/test-tools/react'

import UserDataPixel from '../components/UserDataPixel'

// Mock dependencies
jest.mock('vtex.pixel-manager/PixelContext', () => ({
  usePixel: jest.fn(),
}))

jest.mock('../hooks/getUserData', () => ({
  getSessionPromiseFromWindow: jest.fn(),
  getUserData: jest.fn(),
}))

const mockUsePixel = require('vtex.pixel-manager/PixelContext').usePixel
const mockGetSessionPromise = require('../hooks/getUserData').getSessionPromiseFromWindow
const mockGetUserData = require('../hooks/getUserData').getUserData

describe('UserDataPixel', () => {
  let mockPush

  beforeEach(() => {
    mockPush = jest.fn()
    mockUsePixel.mockReturnValue({ push: mockPush })
    
    mockGetSessionPromise.mockClear()
    mockGetUserData.mockClear()
    mockPush.mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render without visible content', () => {
    mockGetSessionPromise.mockResolvedValue({
      response: {
        namespaces: {
          profile: {
            id: { value: 'test-user-id' },
            email: { value: 'test@example.com' },
          },
        },
      },
    })

    const { container } = render(<UserDataPixel />)
    expect(container.firstChild).toBeNull()
  })

  it('should push user data pixel when session data is available', async () => {
    const mockSessionData = {
      response: {
        namespaces: {
          profile: {
            id: { value: 'test-user-id' },
            email: { value: 'test@example.com' },
            firstName: { value: 'John' },
            lastName: { value: 'Doe' },
          },
        },
      },
    }

    const mockUserData = {
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    }

    mockGetSessionPromise.mockResolvedValue(mockSessionData)
    mockGetUserData.mockReturnValue(mockUserData)

    render(<UserDataPixel />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith({
        event: 'userData',
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      })
    })

    expect(mockGetUserData).toHaveBeenCalledWith(mockSessionData.response.namespaces.profile)
  })

  it('should not push pixel when profile fields are not available', async () => {
    const mockSessionData = {
      response: {
        namespaces: {},
      },
    }

    mockGetSessionPromise.mockResolvedValue(mockSessionData)

    render(<UserDataPixel />)

    await waitFor(() => {
      expect(mockGetSessionPromise).toHaveBeenCalled()
    })

    expect(mockGetUserData).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should not push pixel when namespaces are not available', async () => {
    const mockSessionData = {
      response: {},
    }

    mockGetSessionPromise.mockResolvedValue(mockSessionData)

    render(<UserDataPixel />)

    await waitFor(() => {
      expect(mockGetSessionPromise).toHaveBeenCalled()
    })

    expect(mockGetUserData).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should not push pixel when response is not available', async () => {
    const mockSessionData = {}

    mockGetSessionPromise.mockResolvedValue(mockSessionData)

    render(<UserDataPixel />)

    await waitFor(() => {
      expect(mockGetSessionPromise).toHaveBeenCalled()
    })

    expect(mockGetUserData).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should call push function only once per mount', async () => {
    const mockSessionData = {
      response: {
        namespaces: {
          profile: {
            id: { value: 'test-user-id' },
          },
        },
      },
    }

    const mockUserData = { id: 'test-user-id' }

    mockGetSessionPromise.mockResolvedValue(mockSessionData)
    mockGetUserData.mockReturnValue(mockUserData)

    const { rerender } = render(<UserDataPixel />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1)
    })

    // Rerender should not cause another call
    rerender(<UserDataPixel />)

    // Wait a bit more and verify no additional calls
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  it('should use the push function from usePixel hook', () => {
    const customPush = jest.fn()
    mockUsePixel.mockReturnValue({ push: customPush })

    mockGetSessionPromise.mockResolvedValue({
      response: {
        namespaces: {
          profile: { id: { value: 'test-id' } },
        },
      },
    })
    mockGetUserData.mockReturnValue({ id: 'test-id' })

    render(<UserDataPixel />)

    expect(mockUsePixel).toHaveBeenCalled()
  })

  it('should handle empty user data', async () => {
    const mockSessionData = {
      response: {
        namespaces: {
          profile: {
            id: { value: 'test-user-id' },
          },
        },
      },
    }

    mockGetSessionPromise.mockResolvedValue(mockSessionData)
    mockGetUserData.mockReturnValue({}) // Empty user data

    render(<UserDataPixel />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith({
        event: 'userData',
      })
    })
  })
})

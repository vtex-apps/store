/* eslint-env jest */
/* eslint-disable react/prop-types */
import React from 'react'
import { render, waitFor } from '@vtex/test-tools/react'
import { MockedProvider } from '@apollo/react-testing'

import { AdsProviderSF } from '../components/AdsProviderSF'

// Mock vtex.store-resources - this will use the __mocks__ directory  
jest.mock('vtex.store-resources')

// Mock external dependencies
jest.mock('vtex.render-runtime', () => ({
  useRuntime: () => ({
    account: 'test-account',
    getSettings: jest.fn((app) => {
      if (app === 'vtex.store') {
        return { publisherId: 'test-publisher-id' }
      }
      return {}
    })
  }),
}))

jest.mock('@vtex/ads-react', () => ({
  AdsProvider: ({ children, identity, hydrationStrategy }) => (
    <div data-testid="ads-provider" data-identity={JSON.stringify(identity)} data-hydration-strategy={JSON.stringify(hydrationStrategy)}>
      {children}
    </div>
  )
}))

jest.mock('../hooks/getUserData', () => ({
  getSessionPromiseFromWindow: jest.fn(),
  getUserData: jest.fn()
}))

// Mock the product search query
jest.doMock('vtex.store-resources/QueryProductSearchV3', () => ({}), { virtual: true })

describe('AdsProviderSF', () => {
  const mockGetSessionPromise = require('../hooks/getUserData').getSessionPromiseFromWindow
  const mockGetUserData = require('../hooks/getUserData').getUserData

  beforeEach(() => {
    mockGetSessionPromise.mockClear()
    mockGetUserData.mockClear()
  })

  it('should render children directly when no publisherId is provided', () => {
    const useRuntimeMock = require('vtex.render-runtime').useRuntime
    useRuntimeMock.mockReturnValue({
      account: 'test-account',
      getSettings: jest.fn(() => ({})) // No publisherId
    })

    const { getByText, queryByTestId } = render(
      <MockedProvider>
        <AdsProviderSF>
          <div>Test Child</div>
        </AdsProviderSF>
      </MockedProvider>
    )

    expect(getByText('Test Child')).toBeInTheDocument()
    expect(queryByTestId('ads-provider')).not.toBeInTheDocument()
  })

  it('should render AdsProvider when publisherId is provided', async () => {
    const mockSessionData = {
      response: {
        id: 'test-session-id',
        namespaces: {
          profile: {
            id: { value: 'test-user-id' }
          }
        }
      }
    }

    const mockUserData = { id: 'test-user-id' }

    mockGetSessionPromise.mockResolvedValue(mockSessionData)
    mockGetUserData.mockReturnValue(mockUserData)

    const { getByTestId, getByText } = render(
      <MockedProvider>
        <AdsProviderSF>
          <div>Test Child</div>
        </AdsProviderSF>
      </MockedProvider>
    )

    await waitFor(() => {
      expect(getByTestId('ads-provider')).toBeInTheDocument()
    })

    expect(getByText('Test Child')).toBeInTheDocument()

    const adsProvider = getByTestId('ads-provider')
    const identity = JSON.parse(adsProvider.getAttribute('data-identity'))
    
    expect(identity).toEqual({
      accountName: 'test-account',
      publisherId: 'test-publisher-id',
      userId: 'test-user-id',
      sessionId: 'test-session-id',
      channel: 'site'
    })
  })

  it('should handle session data without profile', async () => {
    const mockSessionData = {
      response: {
        id: 'test-session-id',
        namespaces: {}
      }
    }

    mockGetSessionPromise.mockResolvedValue(mockSessionData)

    const { getByTestId } = render(
      <MockedProvider>
        <AdsProviderSF>
          <div>Test Child</div>
        </AdsProviderSF>
      </MockedProvider>
    )

    await waitFor(() => {
      expect(getByTestId('ads-provider')).toBeInTheDocument()
    })

    const adsProvider = getByTestId('ads-provider')
    const identity = JSON.parse(adsProvider.getAttribute('data-identity'))
    
    expect(identity.userId).toBe('mock-user')
    expect(identity.sessionId).toBe('test-session-id')
  })

  it('should use default session id when session response is missing', async () => {
    const mockSessionData = {
      response: {
        namespaces: {}
      }
    }

    mockGetSessionPromise.mockResolvedValue(mockSessionData)

    const { getByTestId } = render(
      <MockedProvider>
        <AdsProviderSF>
          <div>Test Child</div>
        </AdsProviderSF>
      </MockedProvider>
    )

    await waitFor(() => {
      expect(getByTestId('ads-provider')).toBeInTheDocument()
    })

    const adsProvider = getByTestId('ads-provider')
    const identity = JSON.parse(adsProvider.getAttribute('data-identity'))
    
    expect(identity.sessionId).toBe('session-id')
  })

  it('should include hydration strategy with fetcher and matcher', async () => {
    mockGetSessionPromise.mockResolvedValue({
      response: { id: 'test-session', namespaces: {} }
    })

    const { getByTestId } = render(
      <MockedProvider>
        <AdsProviderSF>
          <div>Test Child</div>
        </AdsProviderSF>
      </MockedProvider>
    )

    await waitFor(() => {
      expect(getByTestId('ads-provider')).toBeInTheDocument()
    })

    const adsProvider = getByTestId('ads-provider')
    const hydrationStrategy = JSON.parse(adsProvider.getAttribute('data-hydration-strategy'))
    
    expect(hydrationStrategy.key).toBe('sf')
    expect(typeof hydrationStrategy.fetcher).toBe('object') // Function is serialized as object
    expect(typeof hydrationStrategy.matcher).toBe('object') // Function is serialized as object
  })
})

import React, { FC } from 'react'
import { flushPromises, render } from '@vtex/test-tools/react'
import { MockedProvider } from '@apollo/react-testing'

import installedApp from '../graphql/installedApp.graphql'
import { useCheckoutURL } from '../useCheckoutURL'

describe('useCheckoutURL', () => {
  it('should return the correct URL when checkout major is 0', async () => {
    jest.useFakeTimers()

    const Component: FC = () => {
      const { url } = useCheckoutURL()
      return <div>{url}</div>
    }

    const mockInstalledApp = {
      request: {
        query: installedApp,
        variables: {
          slug: 'vtex.checkout',
        },
      },
      result: {
        data: {
          installedApp: {
            version: '0.4.2',
          },
        },
      },
    }

    const { getByText } = render(<Component />, {
      graphql: { mocks: [mockInstalledApp] },
      MockedProvider,
    })

    await flushPromises()
    jest.runAllTimers()

    expect(getByText('/checkout/#/cart')).toBeTruthy()
  })

  it('should return the correct URL when checkout major is 1', async () => {
    jest.useFakeTimers()

    const Component = () => {
      const { url } = useCheckoutURL()
      return <div>{url}</div>
    }

    const mockInstalledApp = {
      request: {
        query: installedApp,
        variables: {
          slug: 'vtex.checkout',
        },
      },
      result: {
        data: {
          installedApp: {
            version: '1.4.2',
          },
        },
      },
    }

    const { getByText } = render(<Component />, {
      graphql: { mocks: [mockInstalledApp] },
      MockedProvider,
    })

    await flushPromises()
    jest.runAllTimers()

    expect(getByText('/cart')).toBeTruthy()
  })
})

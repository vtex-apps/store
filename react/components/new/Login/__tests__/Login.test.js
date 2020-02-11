import React from 'react'
import { renderWithIntl } from '../testUtils/intl-utils'

import Login from '../Login'

import { AuthStateLazy } from 'vtex.react-vtexid'
import { waitForElement } from '@vtex/test-tools/react'

describe('<Login /> component', () => {
  it('should match snapshot when loading', async () => {
    AuthStateLazy.mockImplementationOnce(({ children }) => children({ loading: true }))

    const { asFragment, getByTestId } = renderWithIntl(<Login isBoxOpen />)
    await Promise.resolve()
    await waitForElement(() => getByTestId('loading-session'))

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot without profile', async () => {
    window.__RENDER_8_SESSION__ = {}
    window.__RENDER_8_SESSION__.sessionPromise = Promise.resolve({
      response: {},
    })
    const { asFragment } = renderWithIntl(<Login isBoxOpen />)
    await Promise.resolve()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot with profile without name', async () => {
    window.__RENDER_8_SESSION__ = {}
    window.__RENDER_8_SESSION__.sessionPromise = Promise.resolve({
      response: {
        namespaces: {
          profile: { email: { value: 'email@vtex.com' } },
        },
      },
    })
    const { asFragment } = renderWithIntl(<Login isBoxOpen />)
    await Promise.resolve()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot with profile with name', async () => {
    window.__RENDER_8_SESSION__ = {}
    window.__RENDER_8_SESSION__.sessionPromise = Promise.resolve({
      response: {
        namespaces: {
          profile: {
            email: { value: 'email@vtex.com' },
            firstName: { value: 'firstName' },
          },
        },
      },
    })
    const { asFragment } = renderWithIntl(<Login isBoxOpen />)
    await Promise.resolve()
    expect(asFragment()).toMatchSnapshot()
  })
})

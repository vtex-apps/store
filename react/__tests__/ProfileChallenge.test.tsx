import React from 'react'
import { useQuery } from 'react-apollo'
import { render, screen, waitFor } from '@vtex/test-tools/react'
import { useRuntime } from 'vtex.render-runtime'

import ProfileChallenge from '../ProfileChallenge'

jest.mock('react-apollo', () => ({
  useQuery: jest.fn(),
}))
jest.mock('vtex.render-runtime', () => ({
  useRuntime: jest.fn(),
  canUseDOM: true,
  Loading: () => <div>Loading...</div>, // eslint-disable-line react/display-name
}))

describe('ProfileChallenge', () => {
  const mockAssign = jest.fn()
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: {
        assign: mockAssign,
        pathname: '/',
        search: '',
        hash: '',
      },
      writable: true,
    })
  })
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRuntime as jest.Mock).mockReturnValue({ rootPath: '' })
  })

  it('shows loading while query is loading', () => {
    ;(useQuery as jest.Mock).mockReturnValue({ loading: true })
    render(<ProfileChallenge page="store.home">child</ProfileChallenge>)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders children if user is authenticated', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      loading: false,
      data: { authenticatedUser: { userId: 'abc123' } },
    })
    render(<ProfileChallenge page="store.home">child</ProfileChallenge>)
    expect(screen.getByText('child')).toBeInTheDocument()
  })

  it('redirects to login if not authenticated', async () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      loading: false,
      data: { authenticatedUser: null },
    })
    render(<ProfileChallenge page="store.home">child</ProfileChallenge>)
    await waitFor(() => {
      expect(mockAssign).toHaveBeenCalledWith('/login?returnUrl=%2F')
    })
  })

  it('does not redirect on login page', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      loading: false,
      data: { authenticatedUser: null },
    })
    render(<ProfileChallenge page="store.login">child</ProfileChallenge>)
    expect(mockAssign).not.toHaveBeenCalled()
  })
})

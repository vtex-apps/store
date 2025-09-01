/* eslint-env jest */
import React from 'react'
import { render, fireEvent, waitFor } from '@vtex/test-tools/react'

// Mock vtex.styleguide - this will use the __mocks__ directory
jest.mock('vtex.styleguide')

import NetworkStatusToast from '../components/NetworkStatusToast'

const { ToastContext } = require('vtex.styleguide')

// Mock react-intl
const mockFormatMessage = jest.fn((descriptor) => descriptor.id)
jest.mock('react-intl', () => ({
  injectIntl: (Component) => (props) => (
    <Component {...props} intl={{ formatMessage: mockFormatMessage }} />
  ),
  intlShape: { isRequired: jest.fn() },
}))

describe('NetworkStatusToast', () => {
  let mockShowToast
  let mockHideToast
  let mockToastState

  beforeEach(() => {
    mockShowToast = jest.fn()
    mockHideToast = jest.fn()
    mockToastState = {
      currentToast: null,
      isToastVisible: false,
    }

    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    })

    // Reset window event listeners
    if (window.addEventListener) {
      window.addEventListener = jest.fn()
    }
    if (window.removeEventListener) {
      window.removeEventListener = jest.fn()
    }

    mockFormatMessage.mockClear()
  })

  const renderWithToastContext = (toastState = mockToastState) => {
    const contextValue = {
      showToast: mockShowToast,
      hideToast: mockHideToast,
      toastState,
    }

    return render(
      <ToastContext.Provider value={contextValue}>
        <NetworkStatusToast />
      </ToastContext.Provider>
    )
  }

  it('should render without crashing', () => {
    const { container } = renderWithToastContext()
    expect(container).toBeInTheDocument()
  })

  it('should add event listeners on mount', () => {
    renderWithToastContext()

    expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function))
    expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('should show toast when going offline', async () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    })

    renderWithToastContext()

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'store/store.network-status.offline',
        dismissable: true,
        duration: Infinity,
      })
    })
  })

  it('should not show toast when offline but toast is already showing', async () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    })

    const toastState = {
      currentToast: { message: 'store/store.network-status.offline' },
      isToastVisible: true,
    }

    renderWithToastContext(toastState)

    await waitFor(() => {
      expect(mockShowToast).not.toHaveBeenCalled()
    })
  })

  it('should hide toast when coming back online', async () => {
    const toastState = {
      currentToast: { message: 'store/store.network-status.offline' },
      isToastVisible: true,
    }

    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    })

    renderWithToastContext(toastState)

    await waitFor(() => {
      expect(mockHideToast).toHaveBeenCalled()
    })
  })

  it('should handle case when navigator is not available', () => {
    const originalNavigator = global.navigator
    delete global.navigator

    expect(() => {
      renderWithToastContext()
    }).not.toThrow()

    global.navigator = originalNavigator
  })

  it('should handle case when window is not available', () => {
    const originalWindow = global.window
    delete global.window

    expect(() => {
      renderWithToastContext()
    }).not.toThrow()

    global.window = originalWindow
  })

  it('should cleanup event listeners on unmount', () => {
    const mockRemoveEventListener = jest.fn()
    window.removeEventListener = mockRemoveEventListener

    const { unmount } = renderWithToastContext()

    unmount()

    expect(mockRemoveEventListener).toHaveBeenCalledWith('online', expect.any(Function))
    expect(mockRemoveEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('should format message using intl', async () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    })

    renderWithToastContext()

    await waitFor(() => {
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'store/store.network-status.offline',
      })
    })
  })

  it('should simulate offline event', async () => {
    const { rerender } = renderWithToastContext()
    
    // Simulate offline event
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    })

    // Trigger the event listener manually since jsdom doesn't fully support navigator events
    const offlineHandler = window.addEventListener.mock.calls.find(
      call => call[0] === 'offline'
    )?.[1]

    if (offlineHandler) {
      offlineHandler()
    }

    // Rerender to trigger the useEffect
    rerender(
      <ToastContext.Provider value={{
        showToast: mockShowToast,
        hideToast: mockHideToast,
        toastState: mockToastState,
      }}>
        <NetworkStatusToast />
      </ToastContext.Provider>
    )

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalled()
    })
  })
})

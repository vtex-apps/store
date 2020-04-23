/* eslint-disable no-restricted-imports */
import { path, pathOr } from 'ramda'
import { useCallback, useContext, useEffect, useState, useRef } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { ToastContext } from 'vtex.styleguide'

function NetworkStatusToast({ intl }) {
  const [offline, setOffline] = useState(false)
  // Useful to dismissable toast flow.
  const [showingOffline, setShowingOffline] = useState(false)
  const { showToast, hideToast, toastState } = useContext(ToastContext)

  const toastConfig = useRef({
    message: '',
    dismissable: true,
    duration: Infinity,
  })

  const updateStatus = useCallback(() => {
    if (navigator) {
      setOffline(!pathOr(true, ['onLine'], navigator))
    }
  }, [])

  useEffect(() => {
    if (window) {
      window.addEventListener('online', updateStatus)
      window.addEventListener('offline', updateStatus)
    }
    updateStatus()
    return function cleanUp() {
      if (window) {
        window.removeEventListener('online', updateStatus)
        window.removeEventListener('offline', updateStatus)
      }
    }
  }, [updateStatus])

  useEffect(() => {
    if (offline && !toastState.currentToast) {
      const message = intl.formatMessage({
        id: 'store/store.network-status.offline',
      })
      toastConfig.current.message = message

      if (!showingOffline) {
        showToast(toastConfig.current)
      }
      setShowingOffline(!showingOffline)
    } else if (
      !offline &&
      toastState.isToastVisible &&
      path(['currentToast', 'message'], toastState) ===
        toastConfig.current.message
    ) {
      hideToast()
      setShowingOffline(false)
    }
  }, [
    offline,
    toastState,
    toastConfig,
    showingOffline,
    showToast,
    hideToast,
    intl,
  ])

  return null
}

NetworkStatusToast.propTypes = {
  intl: intlShape.isRequired,
}

export default injectIntl(NetworkStatusToast)

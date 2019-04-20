import PropTypes from 'prop-types'
import { path, pathOr } from 'ramda'
import { useContext, useEffect, useState } from 'react'
import { defineMessages, injectIntl, intlShape } from 'react-intl'
import { ToastContext } from 'vtex.styleguide'

const messages = defineMessages({
  StoreNetworkStatusOffline: {
    id: 'store/store.network-status.offline',
    defaultMessage: 'No internet connection.'
  },
})

function NetworkStatusToast(props) {
  const toastConfig = {
    message: props.intl.formatMessage({
      id: messages.StoreNetworkStatusOffline.id,
    }),
    dismissable: false,
    duration: Infinity,
  }

  const [offline, setOffline] = useState(false)
  const { showToast, hideToast, toastState } = useContext(ToastContext)

  const updateStatus = () => {
    if (navigator) {
      setOffline(!pathOr(true, ['onLine'], navigator))
    }
  }

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
  }, [])

  useEffect(() => {
    if (offline && !toastState.currentToast) {
      showToast(toastConfig)
    } else if (
      !offline &&
      toastState.isToastVisible &&
      path(['currentToast', 'message'], toastState) === toastConfig.message
    ) {
      hideToast()
    }
  }, [offline, toastState])

  return null
}

NetworkStatusToast.propTypes = {
  intl: intlShape.isRequired,
}

export default injectIntl(NetworkStatusToast)

import PropTypes from 'prop-types'
import { path, pathOr } from 'ramda'
import { useContext, useEffect, useState } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { ToastContext } from 'vtex.styleguide'

function NetworkStatusToast(props) {
  const toastConfig = {
    message: props.intl.formatMessage({
      id: 'store.network-status.offline',
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
  hideToast: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  showToast: PropTypes.func.isRequired,
  toastState: PropTypes.object.isRequired,
}

export default injectIntl(NetworkStatusToast)

import PropTypes from 'prop-types'
import { compose, pathOr } from 'ramda'
import React, { useState, useEffect } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { withToast } from 'vtex.styleguide'

function NetworkStatusToast(props) {
  const toastConfig = {
    message: props.intl.formatMessage({
      id: 'store.network-status.offline',
    }),
    dismissable: false,
    duration: Infinity,
  }

  const [offline, setOffline] = useState(false)
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
    // TODO: This logic will be possible when the ToastProvider provide the `toastState`
    // prop to it's Consumers. This way, the toast can be shown when no other toast is visible.

    /* const { toastState } = props
    if (offline && !toastState.isToastVisible) {
      props.showToast(toastConfig)
    } else if (
      !offline &&
      toastState.isToastVisible &&
      toastState.currentToast.message === this.toastConfig.message
    ) {
      props.hideToast()
    }*/

    if (offline) {
      props.showToast(toastConfig)
    } else {
      props.hideToast()
    }
  }, [offline])

  return null
}

NetworkStatusToast.propTypes = {
  hideToast: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  showToast: PropTypes.func.isRequired,
  // TODO: Same about toastState
  // toastState: PropTypes.object.isRequired,
}

export default compose(
  withToast,
  injectIntl
)(NetworkStatusToast)

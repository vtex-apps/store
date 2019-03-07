import PropTypes from 'prop-types'
import { compose, pathOr } from 'ramda'
import React from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { withToast } from 'vtex.styleguide'

class NetworkStatusToast extends React.Component {
  static propTypes = {
    hideToast: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    showToast: PropTypes.func.isRequired,
    toastState: PropTypes.object.isRequired,
  }

  state = {
    offline: false,
  }

  toastConfig = {
    message: this.props.intl.formatMessage({
      id: 'store.network-status.offline',
    }),
    dismissable: false,
    duration: Infinity,
  }

  updateStatus = () => {
    if (navigator) {
      const offline = !pathOr(true, ['onLine'], navigator)
      if (offline) {
        this.setState({ offline })
      } else {
        this.props.hideToast()
      }
    }
  }

  componentDidMount() {
    if (window) {
      window.addEventListener('online', this.updateStatus)
      window.addEventListener('offline', this.updateStatus)
    }
    this.updateStatus()
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('online', this.updateStatus)
      window.removeEventListener('offline', this.updateStatus)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO: This logic will be possible when the ToastProvider provide the `toastState`
    // prop to it's Consumers. This way, the toast can be shown when no other toast is visible.
    
    /* const { toastState } = this.props
    if (this.state.offline && !toastState.isToastVisible) {
      this.props.showToast(this.toastConfig)
    } else if (
      !this.state.offline &&
      toastState.isToastVisible &&
      toastState.currentToast.message === this.toastConfig.message
    ) {
      this.props.hideToast()
    }*/

    if (this.state.offline) {
      this.props.showToast(this.toastConfig)
    } else if (prevState.offline && !this.state.offline) {
      this.props.hideToast()
    }
  }

  render() {
    return null
  }
}

export default compose(
  withToast,
  injectIntl
)(NetworkStatusToast)

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
  }

  updateStatus = () => {
    if (navigator) {
      const offline = !pathOr(true, ['onLine'], navigator)
      if (offline) {
        this.props.showToast({
          message: this.props.intl.formatMessage({ id: 'store.network-status.offline' }),
          dismissable: false,
          duration: Infinity,
        })
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

  render() {
    return null
  }
}

export default compose(withToast, injectIntl)(NetworkStatusToast)

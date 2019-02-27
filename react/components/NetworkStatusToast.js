import PropTypes from 'prop-types'
import { pathOr } from 'ramda'
import React from 'react'
import { withToast } from 'vtex.styleguide'

class NetworkStatusToast extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    hideToast: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
  }

  updateStatus = () => {
    if (navigator) {
      const offline = !pathOr(true, ['onLine'], navigator)
      if (offline) {
        this.props.showToast({
          message: 'Offline',
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
    console.log('wot', this.props)
    return null
  }
}

export default withToast(NetworkStatusToast)

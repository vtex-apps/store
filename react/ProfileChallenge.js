import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { withRuntimeContext, Loading } from 'vtex.render-runtime'

const LOGIN_PATH = '/login'
const API_SESSION_URL = '/api/sessions?items=*'

class ProfileChallenge extends PureComponent {
  static propTypes = {
    page: PropTypes.string,
    pages: PropTypes.object,
    runtime: PropTypes.shape({
      navigate: PropTypes.func,
    }),
    children: PropTypes.node,
    loader: PropTypes.element,
  }

  state = {
    loading: true,
    loggedIn: false,
  }

  componentDidMount() {
    this.onUpdate()
  }

  componentDidUpdate() {
    if (this.state.loggedIn && !this.state.loading) {
      this.onUpdate()
    }
  }

  redirectToLogin() {
    const pathName = window.location.pathname.replace(/\/$/, '')
    if (this.props.page !== 'store.login' && pathName !== LOGIN_PATH) {
      this.props.runtime.navigate({
        fallbackToWindowLocation: false,
        query: `returnUrl=${encodeURIComponent(pathName)}`,
        to: LOGIN_PATH,
      })
    }
  }

  onUpdate() {
    fetch(API_SESSION_URL, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(response => {
        if (
          response.namespaces &&
          (response.namespaces.authentication.storeUserId ||
            response.namespaces.impersonate.storeUserId)
        ) {
          this.setState({ loading: false, loggedIn: true })
        } else {
          return Promise.reject()
        }
      })
      .catch(() => {
        this.setState({ loading: false, loggedIn: false })
        this.redirectToLogin()
      })
  }

  render() {
    const { children } = this.props
    const { loggedIn, loading } = this.state

    if (loading) {
      return (
        <div className="flex justify-center ma4">
          <Loading />
        </div>
      )
    }

    if (loggedIn) {
      return children
    }

    return null
  }
}

export default withRuntimeContext(ProfileChallenge)

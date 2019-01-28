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
    logged: false,
  }

  componentDidMount() {
    this.onUpdate()
  }

  componentDidUpdate() {
    this.onUpdate()
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
          this.setState({ loading: false, logged: true })
        } else {
          this.setState({ loading: false, logged: false })
          this.redirectToLogin()
        }
      })
      .catch(() => {
        this.setState({ loading: false, logged: false })
        this.redirectToLogin()
      })
  }

  render() {
    const { children } = this.props
    const { logged, loading } = this.state

    if (loading) {
      return (
        <div className="flex justify-center ma4">
          <Loading />
        </div>
      )
    }

    if (logged) {
      return children
    }

    return null
  }
}

export default withRuntimeContext(ProfileChallenge)

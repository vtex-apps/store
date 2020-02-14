import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Services, Validations, Constants } from '../utils'
import Context from '../context'
import getError from '../utils/getError'

class RegisterMfaAuthenticator extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    setGlobalLoading: PropTypes.func.isRequired,
    skip: PropTypes.bool,
    useNewSession: PropTypes.bool,
    parentAppId: PropTypes.string,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
  }

  static defaultProps = {
    skip: false,
    useNewSession: false,
    onSuccess: () => {},
    onFailure: () => {},
  }

  static defaultState = {
    loading: false,
    error: null,
    data: null,
  }

  state = RegisterMfaAuthenticator.defaultState

  startAuthenticatorRegistration = () => {
    const {
      useNewSession,
      setGlobalLoading,
      onSuccess,
      onFailure,
      parentAppId,
    } = this.props
    this.setState({ loading: true })
    setGlobalLoading(true)

    const onDone = () => {
      setGlobalLoading(false)
      this.setState({ loading: false })
    }

    return (useNewSession
      ? Services.withMfaSession(
          () => Services.registerMfaAuthenticator({ parentAppId }),
          {
            parentAppId,
          }
        )
      : Services.registerMfaAuthenticator({ parentAppId })
    )
      .then(data => {
        const { authStatus } = data

        if (authStatus !== Constants.ApiAuthStatus.Pending) {
          this.setState({ error: getError(authStatus) })
          onDone()
          return
        }

        this.setState({
          ...RegisterMfaAuthenticator.defaultState,
          data,
          error: null,
        })

        onSuccess(data)
        onDone()
      })
      .catch(error => {
        this.setState({ ...RegisterMfaAuthenticator.defaultState, error })
        onFailure(getError(error))
        onDone()
      })
  }

  componentDidMount() {
    if (!this.props.skip) {
      this.startAuthenticatorRegistration()
    }
  }

  render() {
    const { loading, error, data } = this.state
    const { children } = this.props
    return children({
      value: data,
      loading,
      error,
      validation: Validations,
      action: this.startAuthenticatorRegistration,
    })
  }
}

const Wrapper = props => (
  <Context.Consumer>
    {({ handlers: { setGlobalLoading }, parentAppId }) => (
      <RegisterMfaAuthenticator
        {...props}
        setGlobalLoading={setGlobalLoading}
        parentAppId={parentAppId}
      />
    )}
  </Context.Consumer>
)

export default Wrapper

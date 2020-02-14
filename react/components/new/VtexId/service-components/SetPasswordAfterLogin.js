import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Context from '../context'
import { Services, Validations, Constants } from '../utils'
const { ApiAuthStatus: API_AUTH_STATUS } = Constants

export default class SetPasswordAfterLogin extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    disableSetPreference: PropTypes.bool,
  }

  static defaultProps = {
    onSuccess: () => {},
    onFailure: () => {},
    disableSetPreference: false,
  }

  state = {
    loading: false,
    error: null,
  }

  setPassword = ({
    account,
    scope,
    password,
    setGlobalLoading,
    parentAppId,
  }) => {
    const { onSuccess, onFailure, disableSetPreference } = this.props
    return Services.setPasswordAfterLogin({
      accountName: account,
      scope,
      password,
      setPreference: !disableSetPreference,
      parentAppId,
    })
      .then(({ authStatus } = { authStatus: 'UnexpectedError' }) => {
        this.setState({ loading: false }, () => {
          if (authStatus === API_AUTH_STATUS.Success) {
            return setGlobalLoading(false, onSuccess)
          }
          return setGlobalLoading(false, () => onFailure({ authStatus }))
        })
      })
      .catch(error => {
        this.setState({ loading: false, error }, () => {
          setGlobalLoading(false, () => onFailure(error))
        })
      })
  }

  render() {
    return (
      <Context.Consumer>
        {({
          state: { email, password, scope, account },
          handlers: { setGlobalLoading },
          parentAppId,
        }) =>
          this.props.children({
            state: { email, password },
            loading: this.state.loading,
            action: () => {
              this.setState({ loading: true })
              setGlobalLoading(true)
              return this.setPassword({
                account,
                scope,
                password,
                setGlobalLoading,
                parentAppId,
              })
            },
            validation: Validations,
          })
        }
      </Context.Consumer>
    )
  }
}

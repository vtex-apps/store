import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Context from '../context'
import { Services, Validations, Constants } from '../utils'
const { ApiAuthStatus: API_AUTH_STATUS } = Constants
import getError from '../utils/getError'
// import ReCAPTCHA from './ReCAPTCHA'

export default class LoginWithAccessKey extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    saveUserAccount: PropTypes.bool,
    disableSetPreference: PropTypes.bool,
  }

  static defaultProps = {
    onSuccess: () => {},
    onFailure: () => {},
    disableSetPreference: false,
  }

  state = {
    loading: false,
  }

  verifyToken = ({
    email,
    token,
    userAccounts,
    recaptcha,
    handlers: { setGlobalLoading, handleUserAccountsChange },
    parentAppId,
  }) => {
    const {
      onSuccess,
      onFailure,
      saveUserAccount,
      disableSetPreference,
    } = this.props
    return Services.validateToken({
      login: email,
      accesskey: token,
      recaptcha,
      setPreference: !disableSetPreference,
      parentAppId,
    })
      .then(({ authStatus }) => {
        this.setState({ loading: false }, () => {
          if (authStatus === API_AUTH_STATUS.Success) {
            if (saveUserAccount && !userAccounts.includes(email)) {
              handleUserAccountsChange([...userAccounts, email])
            }
            return setGlobalLoading(false, onSuccess)
          }
          return setGlobalLoading(false, () =>
            onFailure(getError({ authStatus }))
          )
        })
      })
      .catch(errorCode => {
        this.setState({ loading: false }, () => {
          setGlobalLoading(false, () => onFailure(getError(errorCode)))
        })
      })
  }

  render() {
    return (
      <Context.Consumer>
        {({
          state: { email, token, userAccounts, recaptcha },
          handlers,
          parentAppId,
        }) =>
          this.props.children({
            state: { email, token },
            loading: this.state.loading,
            action: () =>
              this.setState({ loading: true }, () =>
                handlers.setGlobalLoading(true, () => {
                  return this.verifyToken({
                    email,
                    token,
                    userAccounts,
                    recaptcha,
                    handlers,
                    parentAppId,
                  })
                })
              ),
            validation: Validations,
          })
        }
      </Context.Consumer>
    )
  }
}

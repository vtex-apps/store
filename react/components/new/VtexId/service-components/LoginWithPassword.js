import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'

import { Services, Validations, Constants, NOOP } from '../utils'
const { ApiAuthStatus: API_AUTH_STATUS } = Constants
import Context from '../context'
import getError from '../utils/getError'

class LoginWithPassword extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    onRequiresSmsMfa: PropTypes.func,
    onRequiresAppMfa: PropTypes.func,
    onRequiresPasswordUpdate: PropTypes.func,
    onRequiresMfaRegistration: PropTypes.func,
    useNewSession: PropTypes.bool,
    saveUserAccount: PropTypes.bool,
    state: PropTypes.object.isRequired,
    handlers: PropTypes.object.isRequired,
    parentAppId: PropTypes.string,
  }

  static defaultProps = {
    onSuccess: () => {},
    onFailure: () => {},
    onRequiresSmsMfa: () => {},
    onRequiresAppMfa: () => {},
    onRequiresPasswordUpdate: () => {},
    onRequiresMfaRegistration: () => {},
    useNewSession: false,
  }

  state = {
    loading: false,
  }

  actionRef = createRef(NOOP)

  validatePassword = ({
    email,
    password,
    userAccounts,
    recaptcha,
    fingerprint,
    handlers: {
      setGlobalLoading,
      setMfaPhone,
      withSession,
      handleUserAccountsChange,
      handleCurrentPasswordChange,
      handlePasswordChange,
    },
  }) => {
    const {
      useNewSession,
      onSuccess,
      onRequiresSmsMfa,
      onRequiresAppMfa,
      onRequiresMfaRegistration,
      onRequiresPasswordUpdate,
      onFailure,
      saveUserAccount,
      parentAppId,
    } = this.props
    this.setState({ loading: true })
    setGlobalLoading(true)
    return (useNewSession
      ? withSession(() =>
          Services.validatePassword({
            login: email,
            password,
            recaptcha,
            fingerprint,
            parentAppId,
          })
        )
      : Services.validatePassword({
          login: email,
          password,
          recaptcha,
          fingerprint,
          parentAppId,
        })
    )
      .then(({ authStatus, phoneNumber }) => {
        this.setState({ loading: false }, () => {
          if (authStatus === API_AUTH_STATUS.Success) {
            if (saveUserAccount && !userAccounts.includes(email)) {
              handleUserAccountsChange([...userAccounts, email])
            }
            return setGlobalLoading(false, onSuccess)
          } else if (authStatus === API_AUTH_STATUS.RequiresMFAAuthenticator) {
            return setGlobalLoading(false, onRequiresAppMfa)
          } else if (authStatus === API_AUTH_STATUS.RequiresPhoneRegistration) {
            return setGlobalLoading(false, onRequiresMfaRegistration)
          } else if (authStatus === API_AUTH_STATUS.RequiresMFA) {
            return setMfaPhone(phoneNumber, onRequiresSmsMfa)
          } else if (authStatus === API_AUTH_STATUS.ExpiredPassword) {
            return setGlobalLoading(false, () => {
              handleCurrentPasswordChange(password)
              handlePasswordChange('')
              onRequiresPasswordUpdate()
            })
          }

          return setGlobalLoading(false, () =>
            onFailure(getError({ authStatus }))
          )
        })
      })
      .catch(({ response }) => {
        const error = response && response.data

        this.setState({ loading: false }, () => {
          setGlobalLoading(false, () => onFailure(getError(error)))
        })
      })
  }

  componentDidUpdate() {
    const {
      email,
      password,
      userAccounts,
      recaptcha,
      fingerprint,
    } = this.props.state
    this.actionRef.current = () => {
      this.props.handlers.handleRecaptchaChange('')
      return this.validatePassword({
        email,
        password,
        userAccounts,
        recaptcha,
        fingerprint,
        handlers: this.props.handlers,
      })
    }
  }

  render() {
    const { email, password } = this.props.state
    return this.props.children({
      state: { email, password },
      loading: this.state.loading,
      action: () => this.actionRef.current(),
      validation: Validations,
    })
  }
}

const Wrapper = props => (
  <Context.Consumer>
    {({ state, handlers, parentAppId }) => (
      <LoginWithPassword
        {...props}
        state={state}
        handlers={handlers}
        parentAppId={parentAppId}
      />
    )}
  </Context.Consumer>
)

export default Wrapper

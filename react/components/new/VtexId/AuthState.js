import React, { useState, useCallback, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useRuntime } from 'vtex.render-runtime'

import Context from './context'
import { Services, Validations, UserAccounts, Constants, NOOP } from './utils'
import UnexpectedError from './errors/UnexpectedError'
import CurrentPassword from './state-components/CurrentPassword'
import Email from './state-components/Email'
import IdentityProviders from './state-components/IdentityProviders'
import Login from './state-components/Login'
import Password from './state-components/Password'
import PhoneNumber from './state-components/PhoneNumber'
import Recaptcha from './state-components/Recaptcha'
import Token from './state-components/Token'
import UserAccountsComponent from './state-components/UserAccounts'
import UserInfo from './state-components/UserInfo'
const { SessionDuration: SESSION_DURATION } = Constants
import useStateWithCallback from './utils/useStateWithCallback'

import useAuthStateInitializer from './service-hooks/useAuthStateInitializer'

let sessionTimeout = null

const AuthState = ({
  scope: initialScope,
  returnUrl: initialReturnUrl,
  email: initialEmail,
  parentAppId,
  uiNameAndVersion,
  children,
  skip,
}) => {
  const scope = useMemo(() => initialScope, [initialScope])
  const returnUrl = useMemo(() => initialReturnUrl, [initialReturnUrl])
  const [email, setEmail] = useStateWithCallback(
    Validations.validateEmail(initialEmail) ? initialEmail : null
  )
  const [password, setPassword] = useState(null)
  const [recaptcha, setRecaptcha] = useStateWithCallback(null)
  const [currentPassword, setCurrentPassword] = useState(null)
  const [confirmPass, setConfirmPass] = useState(null)
  const [passwordsMatch, setPasswordsMatch] = useState(false)
  const [token, setToken] = useState(null)
  const [rememberMe] = useState(false)
  const [phoneNumber, setPhoneNumber] = useStateWithCallback(null)
  const [userAccounts, setUserAccounts] = useState([])
  const [meta, setMeta] = useStateWithCallback({ loading: false })
  const [isSessionExpired, setIsSessionExpired] = useState(false)
  const {
    account,
    culture: { locale },
  } = useRuntime()

  const handleConfirmPassChange = useCallback(
    pass => {
      setConfirmPass(pass)
      setPasswordsMatch(pass === password)
    },
    [setConfirmPass, setPasswordsMatch, password]
  )

  const handleTokenChange = useCallback(
    token => {
      if (token === '' || Validations.hasOnlyNumbers(token)) {
        setToken(token.substring(0, 6))
      }
    },
    [setToken]
  )

  const handleUserAccountsChange = useCallback(
    userAccounts => {
      UserAccounts.set(userAccounts)
      setUserAccounts(userAccounts)
    },
    [setUserAccounts]
  )

  const toggleGlobalLoading = useCallback(
    () => setMeta(meta => ({ ...meta, loading: !meta.loading })),
    [setMeta]
  )

  const setGlobalLoading = useCallback(
    (loading, callback = null) => {
      setMeta(meta => ({ ...meta, loading }), callback)
    },
    [setMeta]
  )

  const setMfaPhone = useCallback(
    (phoneNumber, callback = null) => {
      setPhoneNumber(phoneNumber, callback)
      setMeta(meta => ({ ...meta, loading: false }))
    },
    [setPhoneNumber, setMeta]
  )

  useEffect(() => {
    setUserAccounts(UserAccounts.get())
  }, [setUserAccounts])

  const scopeUpper = useMemo(() => scope.toUpperCase(), [scope])

  const {
    loading,
    error,
    value: { identityProviders, userInfo, fingerprint },
  } = useAuthStateInitializer({
    skip,
    scope: scopeUpper,
    parentAppId: parentAppId || uiNameAndVersion,
  })

  return (
    <Context.Provider
      value={{
        loading,
        error,
        parentAppId: parentAppId || uiNameAndVersion,
        state: {
          scope,
          returnUrl,
          email,
          password,
          recaptcha,
          currentPassword,
          confirmPass,
          passwordsMatch,
          token,
          rememberMe,
          phoneNumber,
          userAccounts,
          meta,
          isSessionExpired,
          identityProviders,
          userInfo,
          fingerprint,
          account,
          locale,
        },
        handlers: {
          handleEmailChange: setEmail,
          handlePasswordChange: setPassword,
          handleCurrentPasswordChange: setCurrentPassword,
          handleRecaptchaChange: setRecaptcha,
          handleConfirmPassChange,
          handleTokenChange,
          handlePhoneNumberChange: setPhoneNumber,
          handleRememberMeChange: undefined,
          handleUserAccountsChange,
          toggleGlobalLoading,
          setGlobalLoading,
          setMfaPhone,
          withSession: callback => {
            clearTimeout(sessionTimeout)
            sessionTimeout = setTimeout(() => {
              setIsSessionExpired(true)
            }, SESSION_DURATION)
            return Services.withSession({
              accountName: account,
              returnUrl,
              scope: scopeUpper,
              user: email,
              fingerprint,
              parentAppId: parentAppId || uiNameAndVersion,
            })(callback)
          },
        },
      }}
    >
      {typeof children === 'function'
        ? children({
            loading,
            error:
              !identityProviders && !loading ? new UnexpectedError() : error,
            isSessionExpired,
            identityProviders,
            userInfo,
          })
        : children}
    </Context.Provider>
  )
}

AuthState.CurrentPassword = CurrentPassword
AuthState.Email = Email
AuthState.IdentityProviders = IdentityProviders
AuthState.Login = Login
AuthState.Password = Password
AuthState.PhoneNumber = PhoneNumber
AuthState.Recaptcha = Recaptcha
AuthState.Token = Token
AuthState.UserAccounts = UserAccountsComponent
AuthState.UserInfo = UserInfo

AuthState.defaultProps = {
  scope: 'STORE',
  onFailure: NOOP,
}

AuthState.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.node.isRequired,
  ]).isRequired,
  returnUrl: PropTypes.string,
  email: PropTypes.string,
  scope: PropTypes.oneOf(['ADMIN', 'STORE']),
  skip: PropTypes.bool,
  onUserAuthenticated: PropTypes.func,
  uiNameAndVersion: PropTypes.string,
  parentAppId: PropTypes.string,
}

export default AuthState

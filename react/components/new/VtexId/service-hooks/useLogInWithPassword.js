import { useContext, useCallback } from 'react'

import { Services, Constants, NOOP } from '../utils'
const { ApiAuthStatus: API_AUTH_STATUS } = Constants
import Context from '../context'
import getError from '../utils/getError'
import useRefCallback from '../utils/useRefCallback'
import useStateWithCallback from '../utils/useStateWithCallback'

const useLogInWithPassword = ({
  onSuccess = NOOP,
  onFailure = NOOP,
  onRequiresSmsMfa = NOOP,
  onRequiresAppMfa = NOOP,
  onRequiresPasswordUpdate = NOOP,
  onRequiresMfaRegistration = NOOP,
  useNewSession = false,
  saveUserAccount,
} = {}) => {
  const [loading, setLoading] = useStateWithCallback(false)
  const {
    state: { email, password, userAccounts, recaptcha, fingerprint },
    handlers: {
      handleRecaptchaChange,
      setGlobalLoading,
      setMfaPhone,
      withSession,
      handleUserAccountsChange,
      handleCurrentPasswordChange,
      handlePasswordChange,
    },
    parentAppId,
  } = useContext(Context)

  const validatePassword = useCallback(() => {
    setLoading(true)
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
        setLoading(false, () => {
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

        setLoading(false, () => {
          setGlobalLoading(false, () => onFailure(getError(error)))
        })
      })
  }, [
    setLoading,
    setGlobalLoading,
    useNewSession,
    withSession,
    email,
    password,
    recaptcha,
    fingerprint,
    parentAppId,
    saveUserAccount,
    userAccounts,
    onSuccess,
    handleUserAccountsChange,
    onRequiresAppMfa,
    onRequiresMfaRegistration,
    setMfaPhone,
    onRequiresSmsMfa,
    handleCurrentPasswordChange,
    handlePasswordChange,
    onRequiresPasswordUpdate,
    onFailure,
  ])

  const validatePasswordAction = useRefCallback(() => {
    handleRecaptchaChange('')
    return validatePassword()
  }, [handleRecaptchaChange, validatePassword])

  return [validatePasswordAction, { state: { email, password }, loading }]
}

export default useLogInWithPassword

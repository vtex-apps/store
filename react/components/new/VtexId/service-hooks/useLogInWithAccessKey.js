import { useContext, useCallback } from 'react'
import Context from '../context'
import { Services, Constants, NOOP } from '../utils'
const { ApiAuthStatus: API_AUTH_STATUS } = Constants
import getError from '../utils/getError'
import useStateWithCallback from '../utils/useStateWithCallback'
import useRefCallback from '../utils/useRefCallback'

const useLogInWithAccessKey = ({
  onSuccess = NOOP,
  onFailure = NOOP,
  saveUserAccount,
  disableSetPreference = false,
} = {}) => {
  const [loading, setLoading] = useStateWithCallback(false)
  const {
    state: { email, token, userAccounts, recaptcha },
    handlers: { setGlobalLoading, handleUserAccountsChange },
    parentAppId,
  } = useContext(Context)

  const verifyToken = useCallback(() => {
    return Services.validateToken({
      login: email,
      accesskey: token,
      recaptcha,
      setPreference: !disableSetPreference,
      parentAppId,
    })
      .then(({ authStatus }) => {
        setLoading(false, () => {
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
        setLoading(false, () => {
          setGlobalLoading(false, () => onFailure(getError(errorCode)))
        })
      })
  }, [
    email,
    token,
    recaptcha,
    disableSetPreference,
    parentAppId,
    setLoading,
    setGlobalLoading,
    saveUserAccount,
    userAccounts,
    onSuccess,
    handleUserAccountsChange,
    onFailure,
  ])

  const verifyTokenAction = useRefCallback(() => {
    setLoading(true, () => {
      setGlobalLoading(true, () => {
        return verifyToken()
      })
    })
  }, [setLoading, setGlobalLoading, verifyToken])

  return [
    verifyTokenAction,
    {
      state: { email, token },
      loading,
    },
  ]
}

export default useLogInWithAccessKey

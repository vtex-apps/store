import { useContext, useCallback } from 'react'
import Context from '../context'
import { Services, Constants, NOOP } from '../utils'
const { ApiAuthStatus: API_AUTH_STATUS } = Constants
import useStateWithCallback from '../utils/useStateWithCallback'
import useRefCallback from '../utils/useRefCallback'

const useSetPasswordAfterLogin = ({
  onSuccess = NOOP,
  onFailure = NOOP,
  disableSetPreference = false,
} = {}) => {
  const [loading, setLoading] = useStateWithCallback(false)
  const {
    state: { email, password, scope, account },
    handlers: { setGlobalLoading },
    parentAppId,
  } = useContext(Context)

  const setPassword = useCallback(() => {
    return Services.setPasswordAfterLogin({
      accountName: account,
      scope,
      password,
      setPreference: !disableSetPreference,
      parentAppId,
    })
      .then(({ authStatus } = { authStatus: 'UnexpectedError' }) => {
        setLoading(false, () => {
          if (authStatus === API_AUTH_STATUS.Success) {
            return setGlobalLoading(false, onSuccess)
          }
          return setGlobalLoading(false, () => onFailure({ authStatus }))
        })
      })
      .catch(error => {
        setLoading(false, () => {
          setGlobalLoading(false, () => onFailure(error))
        })
      })
  }, [
    account,
    scope,
    password,
    disableSetPreference,
    parentAppId,
    setLoading,
    setGlobalLoading,
    onSuccess,
    onFailure,
  ])

  const setPasswordAction = useRefCallback(() => {
    setLoading(true)
    setGlobalLoading(true)
    return setPassword()
  }, [setLoading, setGlobalLoading, setPassword])

  return [
    setPasswordAction,
    {
      state: { email, password },
      loading,
    },
  ]
}

export default useSetPasswordAfterLogin

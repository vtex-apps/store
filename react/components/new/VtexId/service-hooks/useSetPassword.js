import { useContext, useCallback } from 'react'
import { Services, Constants, NOOP } from '../utils'
const { ApiAuthStatus: API_AUTH_STATUS } = Constants
import Context from '../context'
import getError from '../utils/getError'
import useRefCallback from '../utils/useRefCallback'
import useStateWithCallback from '../utils/useStateWithCallback'

const useSetPassword = ({ onSuccess = NOOP, onFailure = NOOP } = {}) => {
  const [loading, setLoading] = useStateWithCallback(false)
  const {
    state: { email, password, currentPassword, token },
    handlers: { setGlobalLoading },
    parentAppId,
  } = useContext(Context)

  const recaptcha = null

  const setPassword = useCallback(() => {
    return Services.setPassword({
      login: email,
      newPassword: password,
      currentPassword,
      accesskey: token,
      recaptcha,
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
          setGlobalLoading(false, () => onFailure(getError(error)))
        })
      })
  }, [
    email,
    password,
    currentPassword,
    token,
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
      state: { email, password, currentPassword, token },
      loading,
    },
  ]
}

export default useSetPassword

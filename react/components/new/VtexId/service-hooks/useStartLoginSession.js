import { useContext, useCallback } from 'react'
import { Services, NOOP } from '../utils'
import Context from '../context'
import useRefCallback from '../utils/useRefCallback'
import useStateWithCallback from '../utils/useStateWithCallback'

const useStartLoginSession = ({ onSuccess = NOOP, onFailure = NOOP } = {}) => {
  const [loading, setLoading] = useStateWithCallback(false)
  const {
    state: { account, returnUrl, scope, email },
    handlers: { setGlobalLoading },
    parentAppId,
  } = useContext(Context)

  const startSession = useCallback(() => {
    return Services.startSession({
      accountName: account,
      returnUrl,
      scope,
      user: email,
      parentAppId,
    })
      .then(() => {
        setLoading(false, () => {
          return setGlobalLoading(false, onSuccess)
        })
      })
      .catch(error => {
        setLoading(false, () => {
          setGlobalLoading(false, () => onFailure(error))
        })
      })
  }, [
    account,
    returnUrl,
    scope,
    email,
    parentAppId,
    setLoading,
    setGlobalLoading,
    onSuccess,
    onFailure,
  ])

  const startSessionAction = useRefCallback(() => {
    setLoading(true, () => setGlobalLoading(true, startSession))
  }, [setLoading, setGlobalLoading, startSession])

  return [
    startSessionAction,
    {
      state: { email },
      loading,
    },
  ]
}

export default useStartLoginSession

import { useContext, useCallback, useEffect } from 'react'
import { Services, Constants, NOOP } from '../utils'
import getError from '../utils/getError'
const { ApiAuthStatus: API_AUTH_STATUS } = Constants
import Context from '../context'
import useStateWithCallback from '../utils/useStateWithCallback'
import useRefCallback from '../utils/useRefCallback'

const useValidateMfa = ({ onSuccess = NOOP, onFailure = NOOP } = {}) => {
  const [loading, setLoading] = useStateWithCallback(false)
  const {
    state: { token },
    handlers: { setGlobalLoading, handleTokenChange },
    parentAppId,
  } = useContext(Context)

  const validateMfa = useCallback(() => {
    return Services.validateMfa({ mfaToken: token, parentAppId })
      .then(({ authStatus }) => {
        setLoading(false, () => {
          if (authStatus === API_AUTH_STATUS.Success) {
            setGlobalLoading(false, onSuccess)
            return
          }
          setGlobalLoading(false, () => onFailure(getError({ authStatus })))
        })
      })
      .catch(errorCode => {
        setLoading(false, () => {
          setGlobalLoading(false, () => onFailure(getError(errorCode)))
        })
      })
  }, [token, parentAppId, setLoading, setGlobalLoading, onSuccess, onFailure])

  const validateMfaAction = useRefCallback(() => {
    setLoading(true, () => {
      setGlobalLoading(true, validateMfa)
    })
  }, [setLoading, setGlobalLoading, validateMfa])

  useEffect(() => {
    return () => handleTokenChange('')
  }, [handleTokenChange])

  return [
    validateMfaAction,
    {
      state: { token },
      loading,
    },
  ]
}

export default useValidateMfa

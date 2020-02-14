import { useState, useContext, useCallback } from 'react'
import { Services, NOOP } from '../utils'
import Context from '../context'
import useRefCallback from '../utils/useRefCallback'
import useStateWithCallback from '../utils/useStateWithCallback'

const useResendMfaToken = ({ onSuccess = NOOP, onFailure = NOOP } = {}) => {
  const [loading, setLoading] = useStateWithCallback()
  const [error, setError] = useState()
  const {
    state: { phoneNumber },
    handlers: { setGlobalLoading },
    parentAppId,
  } = useContext(Context)

  const recaptcha = null

  const resendMfaToken = useCallback(() => {
    return Services.resendMfa({ recaptcha, parentAppId })
      .then(({ authStatus }) => {
        setLoading(false, () => {
          if (authStatus === 'Pending') {
            setGlobalLoading(false, onSuccess)
            return
          }
          setGlobalLoading(false, () => onFailure({ authStatus }))
        })
      })
      .catch(error => {
        setError(error)
        setLoading(false, () => {
          setGlobalLoading(false, () => onFailure(error))
        })
      })
  }, [
    recaptcha,
    parentAppId,
    setLoading,
    setGlobalLoading,
    onSuccess,
    onFailure,
    setError,
  ])

  const resendMfaTokenAction = useRefCallback(() => {
    setLoading(true, () => {
      setGlobalLoading(true, resendMfaToken)
    })
  }, [setLoading, setGlobalLoading, resendMfaToken])

  return [
    resendMfaTokenAction,
    {
      state: { phoneNumber },
      loading,
      error,
    },
  ]
}

export default useResendMfaToken

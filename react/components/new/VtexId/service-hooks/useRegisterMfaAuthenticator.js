import { useState, useContext, useEffect } from 'react'

import { Services, Constants, NOOP } from '../utils'
import Context from '../context'
import getError from '../utils/getError'
import useRefCallback from '../utils/useRefCallback'

const useRegisterMfaAuthenticator = ({
  skip = false,
  useNewSession = false,
  onSuccess = NOOP,
  onFailure = NOOP,
} = {}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const {
    handlers: { setGlobalLoading },
    parentAppId,
  } = useContext(Context)

  const startAuthenticatorRegistration = useRefCallback(() => {
    setLoading(true)
    setGlobalLoading(true)

    const onDone = () => {
      setGlobalLoading(false)
      setLoading(false)
    }

    return (useNewSession
      ? Services.withMfaSession(
          () => Services.registerMfaAuthenticator({ parentAppId }),
          {
            parentAppId,
          }
        )
      : Services.registerMfaAuthenticator({ parentAppId })
    )
      .then(data => {
        const { authStatus } = data

        if (authStatus !== Constants.ApiAuthStatus.Pending) {
          setError(getError(authStatus))
          onDone()
          return
        }

        setLoading(false)
        setError(null)
        setData(data)
        onSuccess(data)
        onDone()
      })
      .catch(error => {
        setLoading(false)
        setError(error)
        setData(null)
        onFailure(getError(error))
        onDone()
      })
  }, [
    setLoading,
    setGlobalLoading,
    useNewSession,
    Services,
    parentAppId,
    Constants,
    setError,
    getError,
    setData,
    onSuccess,
    onFailure,
  ])

  useEffect(() => {
    if (!skip) {
      startAuthenticatorRegistration()
    }
  }, [skip, startAuthenticatorRegistration])

  return [
    startAuthenticatorRegistration,
    {
      value: data,
      loading,
      error,
    },
  ]
}

export default useRegisterMfaAuthenticator

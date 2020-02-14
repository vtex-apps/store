import { useState, useEffect, useContext } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import { Services, NOOP } from '../utils'
import getError from '../utils/getError'
import useRefCallback from '../utils/useRefCallback'

import Context from '../context'

const useGetIdentityProviders = ({
  onSuccess = NOOP,
  onFailure = NOOP,
  skip = false,
} = {}) => {
  const [loading, setLoading] = useState(!skip)
  const [providers, setProviders] = useState()
  const [error, setError] = useState()
  const { account } = useRuntime()
  const {
    parentAppId,
    state: { scope },
  } = useContext(Context)

  const fetchIdentityProviders = useRefCallback(() => {
    Services.getIdentityProviders({
      accountName: account,
      scopeName: scope,
      parentAppId,
    }).then(
      ({
        oAuthProviders,
        samlProviders,
        passwordAuthentication: password,
        accessKeyAuthentication: accessKey,
      }) => {
        setProviders({
          oAuthProviders,
          samlProviders,
          password,
          accessKey,
        })
      },
      error => {
        setError(error)
        onFailure(getError(error))
      }
    )
  }, [Services, account, scope, setProviders, setError, onFailure, getError])

  useEffect(() => {
    !skip && fetchIdentityProviders()
  }, [skip, fetchIdentityProviders])

  useEffect(() => {
    if (providers) {
      setLoading(false)
      onSuccess()
    }
  }, [providers, setLoading, onSuccess])

  return [
    fetchIdentityProviders,
    {
      loading,
      error,
      value: providers,
    },
  ]
}

export default useGetIdentityProviders

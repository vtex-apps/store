import { useState, useEffect, useCallback } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { Services, NOOP } from '../utils'
import getError from '../utils/getError'

const useAuthStateInitializer = ({
  scope = 'STORE',
  onSuccess = NOOP,
  onFailure = NOOP,
  skip = false,
  parentAppId = null,
} = {}) => {
  const [loading, setLoading] = useState(!skip)
  const [data, setData] = useState()
  const [error, setError] = useState()
  const { account } = useRuntime()

  const fetchInitialData = useCallback(() => {
    Services.getInitialData({
      accountName: account,
      scopeName: scope,
      parentAppId,
    }).then(
      ({
        identityProviders: {
          oAuthProviders,
          samlProviders,
          passwordAuthentication: password,
          accessKeyAuthentication: accessKey,
        },
        userInfo,
        fingerprint,
      }) => {
        setData({
          identityProviders: {
            oAuthProviders,
            samlProviders,
            password,
            accessKey,
          },
          userInfo,
          fingerprint,
        })
      },
      error => {
        setError(error)
      }
    )
  }, [account, parentAppId, scope])

  useEffect(() => {
    !skip && fetchInitialData()
  }, [skip, fetchInitialData])

  useEffect(() => {
    if (data) {
      setLoading(false)
      onSuccess(data)
    }
  }, [data, setLoading, onSuccess])

  useEffect(() => {
    if (error) {
      setLoading(false)
      onFailure(getError(error))
    }
  }, [error, setLoading, onFailure])

  return {
    loading,
    error,
    value: data || {
      identityProviders: null,
      userInfo: null,
    },
  }
}

export default useAuthStateInitializer

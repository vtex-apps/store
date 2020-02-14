import { useState, useEffect, useContext } from 'react'

import Context from '../context'
import { Services, NOOP } from '../utils'
import getError from '../utils/getError'
import useRefCallback from '../utils/useRefCallback'

const preferenceByKey = {
  NoPreference: 'NO_PREFERENCE',
  Password: 'PASSWORD',
  AccessKey: 'TOKEN',
}

const useGetLoginPreference = ({ onSuccess = NOOP, onFailure = NOOP } = {}) => {
  const [loading, setLoading] = useState(true)
  const [loginPreference, setLoginPreference] = useState()
  const [error, setError] = useState()
  const {
    state: { email, scope, account },
    parentAppId,
  } = useContext(Context)

  const fetchLoginPreference = useRefCallback(
    (givenEmail = email) => {
      Services.getLoginPreference({
        accountName: account,
        scopeName: scope,
        email: givenEmail,
        parentAppId,
      })
        .then(data => {
          setLoginPreference(preferenceByKey[data])
        })
        .then(setLoginPreference, error => {
          setError(error)
          onFailure(getError(error))
        })
    },
    [
      Services,
      account,
      scope,
      parentAppId,
      setLoginPreference,
      preferenceByKey,
      setError,
      onFailure,
      getError,
    ]
  )

  useEffect(() => {
    if (loginPreference) {
      setLoading(false)
      onSuccess(loginPreference)
    }
  }, [loginPreference, setLoading, onSuccess])

  return [
    fetchLoginPreference,
    {
      loading,
      error,
      value: loginPreference,
    },
  ]
}

export default useGetLoginPreference

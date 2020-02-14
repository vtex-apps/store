import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { useRuntime } from 'vtex.render-runtime'

import Context from '../context'
import { Services } from '../utils'
import getError from '../utils/getError'

const noop = () => {}

const preferenceByKey = {
  NoPreference: 'NO_PREFERENCE',
  Password: 'PASSWORD',
  AccessKey: 'TOKEN',
}

const GetLoginPreference = ({
  children,
  onSuccess = noop,
  onFailure = noop,
}) => {
  const [loading, setLoading] = useState(true)
  const [loginPreference, setLoginPreference] = useState()
  const [error, setError] = useState()
  const { account } = useRuntime()
  const {
    state: { email, scope },
    parentAppId,
  } = useContext(Context)

  const fetchLoginPreference = (givenEmail = email) => {
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
  }

  useEffect(() => {
    if (loginPreference) {
      setLoading(false)
      onSuccess(loginPreference)
    }
  }, [loginPreference])

  return children({
    loading,
    error,
    value: loginPreference,
    action: fetchLoginPreference,
  })
}

GetLoginPreference.propTypes = {
  children: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
}

export default GetLoginPreference

import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { useRuntime } from 'vtex.render-runtime'

import { Services } from '../utils'
import getError from '../utils/getError'
import Context from '../context'

const noop = () => {}

const GetIdentityProviders = ({
  children,
  scope = 'STORE',
  onSuccess = noop,
  onFailure = noop,
  skip = false,
}) => {
  const [loading, setLoading] = useState(!skip)
  const [providers, setProviders] = useState()
  const [error, setError] = useState()
  const { account } = useRuntime()
  const { parentAppId } = useContext(Context)

  const fetchIdentityProviders = () => {
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
  }

  useEffect(() => {
    !skip && fetchIdentityProviders()
  }, [skip])

  useEffect(() => {
    if (providers) {
      setLoading(false)
      onSuccess()
    }
  }, [providers])

  return children({
    loading,
    error,
    value: providers,
    action: fetchIdentityProviders,
  })
}

GetIdentityProviders.propTypes = {
  children: PropTypes.func.isRequired,
  scope: PropTypes.oneOf(['ADMIN', 'STORE']),
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
  skip: PropTypes.bool,
}

export default GetIdentityProviders

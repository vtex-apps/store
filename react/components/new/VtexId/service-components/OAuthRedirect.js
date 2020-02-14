import { useEffect, useState, useContext, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Services } from '../utils'
import Context from '../context'
import getError from '../utils/getError'

const OAuthRedirect = ({
  children,
  provider,
  onSuccess = () => {},
  onFailure = () => {},
  autorun = false,
  useNewSession = false,
}) => {
  const [loading, setLoading] = useState(false)
  const {
    handlers: { setGlobalLoading, withSession },
  } = useContext(Context)

  const startSessionAndRedirect = useCallback(() => {
    setLoading(true)
    setGlobalLoading(true)

    const onDone = () => {
      setLoading(false)
      setGlobalLoading(false)
    }

    const start = useNewSession
      ? withSession(() => Services.redirectOAuth({ provider }))
      : Services.redirectOAuth({ provider })

    start
      .then(() => {
        onSuccess()
        onDone()
      })
      .catch(error => {
        onFailure(getError(error))
        onDone()
      })
  })

  useEffect(() => {
    autorun && startSessionAndRedirect()
  }, [autorun])

  return children({
    loading,
    action: startSessionAndRedirect,
  })
}

OAuthRedirect.proptypes = {
  children: PropTypes.func.isRequired,
  provider: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
  autorun: PropTypes.bool,
  useNewSession: PropTypes.bool,
}

export default OAuthRedirect

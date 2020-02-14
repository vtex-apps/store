import { useEffect, useState, useContext } from 'react'
import { Services, NOOP } from '../utils'
import Context from '../context'
import getError from '../utils/getError'
import useRefCallback from '../utils/useRefCallback'

const useOAuthRedirect = ({
  provider,
  onSuccess = NOOP,
  onFailure = NOOP,
  autorun = false,
  useNewSession = false,
} = {}) => {
  const [loading, setLoading] = useState(false)
  const {
    handlers: { setGlobalLoading, withSession },
  } = useContext(Context)

  const startSessionAndRedirect = useRefCallback(() => {
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
  }, [
    setLoading,
    setGlobalLoading,
    useNewSession,
    withSession,
    Services,
    provider,
    onSuccess,
    onFailure,
    getError,
  ])

  useEffect(() => {
    autorun && startSessionAndRedirect()
  }, [autorun, startSessionAndRedirect])

  return [startSessionAndRedirect, { loading }]
}

export default useOAuthRedirect

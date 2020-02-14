import { useEffect, useContext } from 'react'
import { Services } from '../utils'
import Context from '../context'
import useRefCallback from '../utils/useRefCallback'

const useRedirectAfterLogin = ({ autorun } = {}) => {
  const {
    state: { returnUrl },
  } = useContext(Context)

  const redirect = useRefCallback(() => Services.redirect({ returnUrl }), [
    Services,
    returnUrl,
  ])

  useEffect(() => {
    autorun && redirect()
  }, [autorun, redirect])

  return [redirect]
}

export default useRedirectAfterLogin

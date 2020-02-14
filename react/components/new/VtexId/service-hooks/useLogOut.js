import { Services, NOOP } from '../utils'
import { useContext, useCallback } from 'react'
import Context from '../context'
import useRefCallback from '../utils/useRefCallback'
import useStateWithCallback from '../utils/useStateWithCallback'

const useLogOut = ({ onSuccess = NOOP, onFailure = NOOP } = {}) => {
  const [loading, setLoading] = useStateWithCallback(false)
  const {
    handlers: { setGlobalLoading },
    parentAppId,
  } = useContext(Context)

  const logOut = useCallback(() => {
    return Services.logout({ parentAppId })
      .then(() => {
        setLoading(false, () => {
          return setGlobalLoading(false, onSuccess)
        })
      })
      .catch(error => {
        setLoading(false, () => {
          setGlobalLoading(false, () => onFailure(error))
        })
      })
  }, [parentAppId, setLoading, setGlobalLoading, onSuccess, onFailure])

  const logOutAction = useRefCallback(() => {
    setLoading(true, () => {
      setGlobalLoading(true, logOut)
    })
  }, [setLoading, setGlobalLoading, logOut])

  return [
    logOutAction,
    {
      loading,
    },
  ]
}

export default useLogOut

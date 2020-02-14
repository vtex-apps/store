import { useContext, useCallback } from 'react'
import { Services, Constants, NOOP } from '../utils'
const { ApiAuthStatus: API_AUTH_STATUS } = Constants
import Context from '../context'
import useRefCallback from '../utils/useRefCallback'
import useStateWithCallback from '../utils/useStateWithCallback'

const useRegisterMfaPhone = ({
  onSuccess = NOOP,
  onFailure = NOOP,
  useNewSession = false,
} = {}) => {
  const [loading, setLoading] = useStateWithCallback(false)
  const {
    state: { phoneNumber },
    handlers: { setGlobalLoading },
    parentAppId,
  } = useContext(Context)

  const recaptcha = null

  const registerMfaPhoneNumber = useCallback(() => {
    return (useNewSession
      ? Services.withMfaSession(
          () =>
            Services.registerMfaPhoneNumber({
              phoneNumber,
              recaptcha,
              parentAppId,
            }),
          { parentAppId }
        )
      : Services.registerMfaPhoneNumber({
          phoneNumber,
          recaptcha,
          parentAppId,
        })
    )
      .then(({ authStatus }) => {
        setLoading(false, () => {
          if (authStatus === API_AUTH_STATUS.Pending) {
            setGlobalLoading(false, onSuccess)
            return
          }
          setGlobalLoading(false, () => onFailure({ authStatus }))
        })
      })
      .catch(error => {
        setLoading(false, () => {
          setGlobalLoading(false, () => {
            onFailure(error)
          })
        })
      })
  }, [
    useNewSession,
    parentAppId,
    phoneNumber,
    setLoading,
    setGlobalLoading,
    onSuccess,
    onFailure,
  ])

  const registerMfaPhoneNumberAction = useRefCallback(() => {
    setLoading(true, () => {
      setGlobalLoading(true, () => {
        registerMfaPhoneNumber()
      })
    })
  }, [setLoading, setGlobalLoading, registerMfaPhoneNumber])

  return [
    registerMfaPhoneNumberAction,
    {
      state: { phoneNumber },
      loading: loading,
    },
  ]
}

export default useRegisterMfaPhone

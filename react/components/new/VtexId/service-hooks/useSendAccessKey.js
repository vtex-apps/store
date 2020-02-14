import { useContext, useCallback } from 'react'
import { Services, NOOP } from '../utils'
import Context from '../context'
import getError from '../utils/getError'
import useRefCallback from '../utils/useRefCallback'
import useStateWithCallback from '../utils/useStateWithCallback'

const useSendAccessKey = ({
  onSuccess = NOOP,
  onFailure = NOOP,
  useNewSession = false,
} = {}) => {
  const [loading, setLoading] = useStateWithCallback(false)
  const {
    state: { email, token, recaptcha, locale },
    handlers: { setGlobalLoading, withSession },
    parentAppId,
  } = useContext(Context)

  const sendToken = useCallback(
    async ({
      email: specificEmail,
      preference,
      recaptcha: specificRecaptcha,
    }) => {
      const user = {
        email: specificEmail || email,
        ...(preference && { preference }),
      }
      const specifiedRecaptcha = specificRecaptcha || recaptcha
      setLoading(true)
      setGlobalLoading(true)
      return (useNewSession
        ? withSession(() =>
            Services.sendVerificationCode({
              email: user.email,
              locale,
              recaptcha: specifiedRecaptcha,
              parentAppId,
            })
          )
        : Services.sendVerificationCode({
            email: user.email,
            locale,
            recaptcha: specifiedRecaptcha,
            parentAppId,
          })
      )
        .then(() => {
          setLoading(false, () => {
            return setGlobalLoading(false, () => onSuccess(user))
          })
        })
        .catch(error => {
          setLoading(false, () => {
            setGlobalLoading(false, () => onFailure(getError(error)))
          })
        })
    },
    [
      email,
      recaptcha,
      setLoading,
      setGlobalLoading,
      useNewSession,
      withSession,
      locale,
      parentAppId,
      onSuccess,
      onFailure,
    ]
  )

  const sendTokenAction = useRefCallback(
    ({ email, preference, recaptcha } = {}) => {
      sendToken({
        email,
        preference,
        recaptcha,
      })
    },
    [sendToken]
  )

  return [
    sendTokenAction,
    {
      state: {
        email,
        token,
        recaptcha,
      },
      loading,
    },
  ]
}

export default useSendAccessKey

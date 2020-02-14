import { useEffect, useState, useContext, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Services } from '../utils'
import Context from '../context'
import getError from '../utils/getError'

function openWindow(url, title) {
  const newWindow = window.open(
    url,
    title,
    'toolbar=no, location=no, directories=no, status=no, copyhistory=no, menubar=no,width=800,height=600,scrollbars=yes'
  )
  if (window.focus) newWindow.focus()
  return newWindow
}

const OAuthPopup = ({
  children,
  provider,
  onSuccess = () => {},
  onFailure = () => {},
  autorun = false,
  useNewSession = false,
}) => {
  const [loading, setLoading] = useState(false)
  const {
    state: { account, returnUrl, scope, email, fingerprint },
    handlers: { setGlobalLoading },
    parentAppId,
  } = useContext(Context)

  const onDone = useCallback(() => {
    setLoading(false)
    setGlobalLoading(false)
  }, [setGlobalLoading])

  const openPopup = useCallback(() => {
    setLoading(true)
    setGlobalLoading(true)

    const getOAuthRedirectUrl = useNewSession
      ? Services.withSession({
          accountName: account,
          returnUrl,
          scope,
          user: email,
          fingerprint,
          parentAppId,
          useOAuthPopup: true,
        })(() => Services.getOAuthRedirectUrl({ provider }))
      : Services.getOAuthRedirectUrl({ provider })

    const popup = openWindow('', provider)
    popup.opener = null
    getOAuthRedirectUrl
      .then(({ url }) => {
        popup.location.assign(url)

        const id = setInterval(() => {
          if (!popup || popup.closed) {
            onFailure(getError({ message: 'OAuth popup window closed' }))
            onDone()
            clearInterval(id)
            return
          }
          try {
            if (popup.location.href.indexOf(window.location.host) !== -1) {
              const qs = new URLSearchParams(popup.location.search)
              const authStatus = qs.get('authStatus')
              if (authStatus === 'Success') {
                popup.close()
                onDone()
                onSuccess()
              }
              clearInterval(id)
            }
            // eslint-disable-next-line
          } catch {}
        }, 500)
      })
      .catch(error => {
        popup.close()
        onFailure(getError(error))
        onDone()
      })
  }, [
    account,
    email,
    fingerprint,
    onDone,
    onFailure,
    onSuccess,
    parentAppId,
    provider,
    returnUrl,
    scope,
    setGlobalLoading,
    useNewSession,
  ])

  useEffect(() => {
    autorun && openPopup()
  }, [autorun, openPopup])

  return children({
    loading,
    action: openPopup,
  })
}

OAuthPopup.proptypes = {
  children: PropTypes.func.isRequired,
  provider: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
  autorun: PropTypes.bool,
  useNewSession: PropTypes.bool,
}

export default OAuthPopup

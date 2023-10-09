import React, { useState, useEffect, FC } from 'react'
import {
  useRuntime,
  canUseDOM,
  Loading,
  SessionResponse,
  Session,
} from 'vtex.render-runtime'

import { getSession } from './modules/session'

const loginPath = '/login'

const getLocation = () =>
  canUseDOM
    ? {
        url:
          window.location.pathname +
          window.location.search +
          window.location.hash,
        pathName: window.location.pathname,
      }
    : {
        url: (global as any).__pathname__,
        pathName: (global as any).__pathname__,
      }

const useSessionResponse = () => {
  const [session, setSession] = useState<SessionResponse>()
  const sessionPromise = getSession()

  useEffect(() => {
    if (!sessionPromise) {
      return
    }

    sessionPromise.then(sessionResponse => {
      const response = sessionResponse.response as SessionResponse

      setSession(response)
    })
  }, [sessionPromise])

  return session
}

function hasSession(session: SessionResponse | undefined): session is Session {
  return (
    session !== undefined &&
    session.type !== 'Unauthorized' &&
    session.type !== 'Forbidden'
  )
}

const useLoginRedirect = (isLoggedIn: boolean | null, page: string) => {
  const { rootPath = '' } = useRuntime()

  useEffect(() => {
    const { url, pathName } = getLocation()
    if (
      isLoggedIn === false &&
      page !== 'store.login' &&
      pathName !== loginPath &&
      canUseDOM
    ) {
      window.location.assign(
        `${rootPath}${loginPath}?returnUrl=${encodeURIComponent(url)}`
      )
    }
  }, [page, isLoggedIn, rootPath])
}

interface Props {
  page: string
}

const ProfileChallenge: FC<Props> = ({ children, page }) => {
  const session = useSessionResponse()
  const isLoggedIn = hasSession(session)
    ? session.namespaces?.profile?.isAuthenticated?.value === 'true'
    : null

  useLoginRedirect(isLoggedIn, page)

  // isLoggedIn null means that we still don't know, session is loading
  if (isLoggedIn === null) {
    return (
      <div className="flex justify-center ma4">
        <Loading />
      </div>
    )
  }

  if (isLoggedIn === false) {
    return null
  }

  return <>{children}</>
}

export default ProfileChallenge

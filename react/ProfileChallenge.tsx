import React, { useEffect, FC } from 'react'
import {
  useRuntime,
  canUseDOM,
  Loading,
} from 'vtex.render-runtime'

import getAuthenticatedUser from './graphql/getAuthenticatedUser.graphql'
import { useQuery } from 'react-apollo'

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

const useStoreGraphqlSession = () => {

  const shouldRunQuery = canUseDOM

  const { data, loading, error } = useQuery(getAuthenticatedUser, {
    skip: !shouldRunQuery,
  })

  return { data, loading, error }
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

  const storeGraphqlSession = useStoreGraphqlSession()
  const isLoggedIn = storeGraphqlSession.loading === false
    ? !!storeGraphqlSession.data?.authenticatedUser?.userId
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

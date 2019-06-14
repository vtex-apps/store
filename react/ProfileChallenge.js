import React, { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'

import { useRuntime, canUseDOM, Loading } from 'vtex.render-runtime'

const LOGIN_PATH = '/login'
const API_SESSION_URL = '/api/sessions?items=*'

function useSafeState(initialState) {
  const [state, setState] = useState(initialState)

  const mountedRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
    return () => (mountedRef.current = false)
  }, [])
  const safeSetState = (...args) => mountedRef.current && setState(...args)

  return [state, safeSetState]
}

const getLocation = () =>
  canUseDOM
    ? {
        url: window.location.pathname + window.location.hash,
        pathName: window.location.pathname,
      }
    : { url: global.__pathname__, pathName: global.__pathname__ }

const ProfileChallenge = ({ children, page }) => {
  const [loading, setLoading] = useSafeState(true)
  const [loggedIn, setLoggedIn] = useSafeState(false)
  const { navigate } = useRuntime()
  const { url, pathName } = getLocation()

  const redirectToLogin = useCallback(() => {
    if (page !== 'store.login' && pathName !== LOGIN_PATH) {
      navigate({
        fallbackToWindowLocation: false,
        to: `${LOGIN_PATH}?returnUrl=${encodeURIComponent(url)}`,
      })
    }
  }, [page, pathName, navigate, url])

  useEffect(() => {
    fetch(API_SESSION_URL, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(response => {
        if (
          response.namespaces &&
          (response.namespaces.authentication.storeUserId ||
            response.namespaces.impersonate.storeUserId)
        ) {
          setLoading(false)
          setLoggedIn(true)
        } else {
          return Promise.reject()
        }
      })
      .catch(() => {
        setLoading(false)
        setLoggedIn(false)
        redirectToLogin()
      })
  }, [page, redirectToLogin, setLoading, setLoggedIn])

  if (loading) {
    return (
      <div className="flex justify-center ma4">
        <Loading />
      </div>
    )
  }

  if (loggedIn) {
    return children
  }

  return null
}

ProfileChallenge.propTypes = {
  page: PropTypes.string,
  children: PropTypes.node,
}

export default ProfileChallenge

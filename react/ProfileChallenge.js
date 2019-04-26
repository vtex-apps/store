import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { useRuntime, Loading } from 'vtex.render-runtime'

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

const ProfileChallenge = ({ children, page }) => {
  const [loading, setLoading] = useSafeState(true)
  const [loggedIn, setLoggedIn] = useSafeState(false)
  const { navigate } = useRuntime()

  useEffect(
    () => {
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
    },
    [page]
  )

  const getLocation = () => {
    const { pathname, hash } = window.location
    const pathName = pathname.replace(/\/$/, '')
    return { url: pathName + hash, pathName }
  }

  const redirectToLogin = () => {
    const { url, pathName } = getLocation()
    if (page !== 'store.login' && pathName !== LOGIN_PATH) {
      navigate({
        fallbackToWindowLocation: false,
        query: `returnUrl=${encodeURIComponent(url)}`,
        to: LOGIN_PATH,
      })
    }
  }

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

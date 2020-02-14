import React, { useEffect, useContext, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Services } from '../utils'
import Context from '../context'

const RedirectAfterLogin = ({ children, autorun }) => {
  const {
    state: { returnUrl },
  } = useContext(Context)

  const redirect = useCallback(() => Services.redirect({ returnUrl }))

  useEffect(() => {
    autorun && redirect()
  }, [autorun])

  return children ? children({ action: redirect }) : null
}

RedirectAfterLogin.propTypes = {
  children: PropTypes.func,
  autorun: PropTypes.bool,
}

export default RedirectAfterLogin

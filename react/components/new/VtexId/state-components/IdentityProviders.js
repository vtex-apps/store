import React from 'react'
import PropTypes from 'prop-types'
import Context from '../context'

const shouldShowGoogleLogin = providers =>
  providers &&
  providers.oAuthProviders &&
  providers.oAuthProviders.length > 0 &&
  providers.oAuthProviders.some(idp => idp.providerName === 'Google')

const IdentityProviders = ({ children }) => (
  <Context.Consumer>
    {({ state: { identityProviders } }) =>
      children({
        value: {
          ...identityProviders,
          googleOAuth: shouldShowGoogleLogin(identityProviders),
        },
      })
    }
  </Context.Consumer>
)

IdentityProviders.propTypes = {
  children: PropTypes.func.isRequired,
}

export default IdentityProviders

import { useContext } from 'react'
import Context from '../context'

const shouldShowGoogleLogin = providers =>
  providers &&
  providers.oAuthProviders &&
  providers.oAuthProviders.length > 0 &&
  providers.oAuthProviders.some(idp => idp.providerName === 'Google')

const useIdentityProviders = () => {
  const {
    state: { identityProviders },
  } = useContext(Context)

  const providers = {
    ...identityProviders,
    googleOAuth: shouldShowGoogleLogin(identityProviders),
  }
  return providers
}

export default useIdentityProviders

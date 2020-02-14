import React from 'react'

export default {
  GetIdentityProviders: React.lazy(() =>
    import('./service-components/GetIdentityProviders')
  ),
  GetLoginPreference: React.lazy(() =>
    import('./service-components/GetLoginPreference')
  ),
  LoginWithAccessKey: React.lazy(() =>
    import('./service-components/LoginWithAccessKey')
  ),
  LoginWithPassword: React.lazy(() =>
    import('./service-components/LoginWithPassword')
  ),
  Logout: React.lazy(() => import('./service-components/Logout')),
  OAuthPopup: React.lazy(() => import('./service-components/OAuthPopup')),
  OAuthRedirect: React.lazy(() => import('./service-components/OAuthRedirect')),
  RedirectAfterLogin: React.lazy(() =>
    import('./service-components/RedirectAfterLogin')
  ),
  RedirectLogout: React.lazy(() =>
    import('./service-components/RedirectLogout')
  ),
  RegisterMfaAuthenticator: React.lazy(() =>
    import('./service-components/RegisterMfaAuthenticator')
  ),
  RegisterMfaPhone: React.lazy(() =>
    import('./service-components/RegisterMfaPhone')
  ),
  ResendMfaToken: React.lazy(() =>
    import('./service-components/ResendMfaToken')
  ),
  SendAccessKey: React.lazy(() => import('./service-components/SendAccessKey')),
  SetPassword: React.lazy(() => import('./service-components/SetPassword')),
  SetPasswordAfterLogin: React.lazy(() =>
    import('./service-components/SetPasswordAfterLogin')
  ),
  StartLoginSession: React.lazy(() =>
    import('./service-components/StartLoginSession')
  ),
  ValidateMfa: React.lazy(() => import('./service-components/ValidateMfa')),
}

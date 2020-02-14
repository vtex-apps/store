import React from 'react'

const AuthStateLazy = React.lazy(() => import('./AuthState'))

AuthStateLazy.CurrentPassword = React.lazy(() =>
  import('./state-components/CurrentPassword')
)
AuthStateLazy.Email = React.lazy(() => import('./state-components/Email'))
AuthStateLazy.IdentityProviders = React.lazy(() =>
  import('./state-components/IdentityProviders')
)
AuthStateLazy.Login = React.lazy(() => import('./state-components/Login'))
AuthStateLazy.Password = React.lazy(() => import('./state-components/Password'))
AuthStateLazy.PhoneNumber = React.lazy(() =>
  import('./state-components/PhoneNumber')
)
AuthStateLazy.Recaptcha = React.lazy(() =>
  import('./state-components/Recaptcha')
)
AuthStateLazy.Token = React.lazy(() => import('./state-components/Token'))
AuthStateLazy.UserAccounts = React.lazy(() =>
  import('./state-components/UserAccounts')
)
AuthStateLazy.UserInfo = React.lazy(() => import('./state-components/UserInfo'))

export default AuthStateLazy

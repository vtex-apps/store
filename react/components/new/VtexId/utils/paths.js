const composeQuerystring = valueObject => {
  return Object.keys(valueObject)
    .map(key => `${key}=${encodeURIComponent(valueObject[key] || '')}`)
    .join('&')
}

/*global __RUNTIME__*/
const rootPath = `${
  __RUNTIME__ && __RUNTIME__.rootPath ? __RUNTIME__.rootPath : ''
}/api/vtexid`

const paths = {
  startLogin: () => `${rootPath}/pub/authentication/startlogin`,
  getIdentityProviders: (account, scope) =>
    `${rootPath}/pub/authentication/providers?scope=${scope}&accountName=${account}`,
  getLoginPreference: (scope, email) => {
    const qs = composeQuerystring({ scope, email })
    return `${rootPath}/pub/authentication/userpreference?${qs}`
  },
  redirect: returnUrl => {
    const qs = returnUrl ? composeQuerystring({ returnUrl }) : ''
    return `${rootPath}/pub/authentication/redirect?${qs}`
  },
  getOAuthRedirectUrl: providerName =>
    `${rootPath}/pub/authentication/oauth/redirect?${composeQuerystring({
      providerName,
    })}`,
  getUserInfo: scope => `${rootPath}/user/info?scope=${scope}`,
  reauthenticateUser: scope => `${rootPath}/refreshtoken?scope=${scope}`,
  setPassword: () => `${rootPath}/pub/authentication/classic/setpassword`,
  sendEmailVerification: () => `${rootPath}/pub/authentication/accesskey/send`,
  validateToken: setPreference =>
    `${rootPath}/pub/authentication/accesskey/validate?setPreference=${!!setPreference}`,
  validatePassword: () => `${rootPath}/pub/authentication/classic/validate`,
  startMfaSetup: () => `${rootPath}/pvt/mfa/start`,
  validateMfa: () => `${rootPath}/pub/mfa/validate`,
  registerMfaPhoneNumber: () => `${rootPath}/pub/mfa/registerphone`,
  registerMfaAuthenticator: () => `${rootPath}/pub/mfa/registerAuthenticator`,
  resendMfa: () => `${rootPath}/pub/mfa/resend`,
  setPasswordAfterLogin: (scope, setPreference) => {
    return `${rootPath}/user/password/quickset?scope=${scope}&setPreference=${!!setPreference}`
  },
  logout: (scope, returnUrl) => {
    const qs = composeQuerystring({
      scope,
      returnUrl,
    })
    return `${rootPath}/pub/logout?${qs}`
  },
}
export default paths

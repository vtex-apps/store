import http from 'axios'
import Paths from './paths'
import Constants from './constants'
import { get as getDeviceFingerprint } from './fingerprint'
import { UnexpectedError } from '../errors'

const getReqConfig = parentAppId => {
  const uiPrefix = parentAppId ? `${parentAppId}/` : ''
  const selfAppId = process.env.VTEX_APP_ID || process.env.VTEX_APP_NAME || ''
  return {
    headers: {
      'vtex-id-ui-version': `${uiPrefix}${selfAppId}`,
    },
  }
}

const buildFormData = valueObject => {
  var form = new FormData()
  Object.keys(valueObject).forEach(key =>
    form.append(key, valueObject[key] || '')
  )
  return form
}

export const startSession = ({
  accountName,
  returnUrl,
  scope,
  user,
  fingerprint,
  useOAuthPopup,
  parentAppId,
}) => {
  const { href } = location
  const absoluteReturnUrl = new URL(decodeURIComponent(returnUrl || '/'), href)
  const absoluteCallbackUrl = new URL(
    useOAuthPopup
      ? Constants.OAuthPopupCallbackUrl
      : Constants.OAuthCallbackUrl,
    href
  )
  const body = buildFormData({
    accountName,
    scope: scope === Constants.Scopes.ADMIN ? '' : accountName,
    returnUrl: absoluteReturnUrl.href,
    callbackUrl: absoluteCallbackUrl.href,
    user,
    fingerprint,
  })
  return http
    .post(Paths.startLogin(), body, getReqConfig(parentAppId))
    .then(({ data }) => data)
}

export const getIdentityProviders = ({
  accountName,
  scopeName,
  parentAppId,
}) => {
  const scope = scopeName === Constants.Scopes.ADMIN ? '' : accountName

  return http
    .get(
      Paths.getIdentityProviders(accountName, scope),
      getReqConfig(parentAppId)
    )
    .then(response => {
      const { status, data } = response
      if (status !== 200) {
        throw new UnexpectedError()
      }
      return Promise.resolve(data)
    })
}

export const getLoginPreference = ({
  accountName,
  scopeName,
  email,
  parentAppId,
}) => {
  const scope = scopeName === Constants.Scopes.ADMIN ? '' : accountName

  return http
    .get(Paths.getLoginPreference(scope, email), getReqConfig(parentAppId))
    .then(response => {
      const { status, data } = response
      if (status !== 200) {
        throw new UnexpectedError()
      }
      return Promise.resolve(data)
    })
}

export const withSession = ({
  accountName,
  returnUrl,
  scope,
  user,
  fingerprint,
  useOAuthPopup,
  parentAppId,
}) => callback =>
  startSession({
    accountName,
    returnUrl,
    scope,
    user,
    fingerprint,
    useOAuthPopup,
    parentAppId,
  }).then(() => (callback ? callback() : null))

export const sendVerificationCode = ({
  email,
  locale,
  recaptcha,
  parentAppId,
}) => {
  const body = buildFormData({
    email,
    locale,
    recaptcha,
  })
  return http
    .post(Paths.sendEmailVerification(), body, getReqConfig(parentAppId))
    .then(({ data }) => data)
}

export const validateToken = ({
  login,
  accesskey,
  recaptcha,
  setPreference,
  parentAppId,
}) => {
  const body = buildFormData({
    login,
    accesskey,
    recaptcha,
  })
  return http
    .post(Paths.validateToken(setPreference), body, getReqConfig(parentAppId))
    .then(({ data }) => data)
}

export const redirect = ({ returnUrl }) => {
  const absoluteReturnUrl = new URL(
    decodeURIComponent(returnUrl || '/'),
    location.href
  )
  location.href = Paths.redirect(absoluteReturnUrl.href)
}

export const redirectOAuth = ({ provider }) =>
  provider && (location.href = Paths.getOAuthRedirectUrl(provider))

export const getOAuthRedirectUrl = ({ provider }) =>
  Promise.resolve({ url: Paths.getOAuthRedirectUrl(provider) })

export const setPassword = ({
  login,
  newPassword,
  currentPassword,
  accesskey,
  recaptcha,
  parentAppId,
}) => {
  const body = buildFormData({
    login,
    newPassword,
    currentPassword,
    accesskey,
    recaptcha,
  })
  return http
    .post(Paths.setPassword(), body, getReqConfig(parentAppId))
    .then(({ data }) => data)
}

export const setPasswordAfterLogin = ({
  accountName,
  scope,
  password,
  setPreference,
  parentAppId,
}) => {
  const body = {
    password,
  }
  const account = scope === Constants.Scopes.ADMIN ? '' : accountName
  return http
    .post(
      Paths.setPasswordAfterLogin(account, setPreference),
      body,
      getReqConfig(parentAppId)
    )
    .then(({ data }) => data)
}

export const validatePassword = ({
  login,
  password,
  recaptcha,
  fingerprint,
  parentAppId,
}) => {
  const body = buildFormData({
    login,
    password,
    recaptcha,
    fingerprint,
  })
  return http
    .post(Paths.validatePassword(), body, getReqConfig(parentAppId))
    .then(({ data }) => data)
}

export const startMfaSetup = ({ parentAppId }) =>
  http
    .post(Paths.startMfaSetup(), null, getReqConfig(parentAppId))
    .then(({ data }) => data)

export const withMfaSession = (callback, { parentAppId }) =>
  startMfaSetup({ parentAppId }).then(() => (callback ? callback() : null))

export const validateMfa = ({ mfaToken, recaptcha, parentAppId }) => {
  const body = buildFormData({
    mfaToken,
    recaptcha,
  })
  return http
    .post(Paths.validateMfa(), body, getReqConfig(parentAppId))
    .then(({ data }) => data)
}

export const registerMfaPhoneNumber = ({
  phoneNumber,
  recaptcha,
  parentAppId,
}) => {
  const body = buildFormData({
    phoneNumber,
    recaptcha,
  })
  return http
    .post(Paths.registerMfaPhoneNumber(), body, getReqConfig(parentAppId))
    .then(({ data }) => data)
}

export const resendMfa = ({ recaptcha, parentAppId }) => {
  const body = buildFormData({
    recaptcha,
  })
  return http
    .post(Paths.resendMfa(), body, getReqConfig(parentAppId))
    .then(({ data }) => data)
}

export const registerMfaAuthenticator = ({ parentAppId }) => {
  return http
    .post(Paths.registerMfaAuthenticator(), null, getReqConfig(parentAppId))
    .then(({ data }) => data)
    .then(data => {
      if (!data || !data.qRCodeUrl) return data
      return {
        ...data,
        qRCodeUrl: data.qRCodeUrl.replace('chs=150x150', 'chs=200x200'),
      }
    })
}

export const redirectLogout = ({ returnUrl }) => {
  const absoluteReturnUrl = new URL(
    decodeURIComponent(returnUrl || '/'),
    location.href
  )
  location.href = Paths.logout(
    encodeURIComponent(location.host),
    absoluteReturnUrl.href
  )
}

export const logout = ({ parentAppId }) =>
  http.get(
    Paths.logout(encodeURIComponent(location.host)),
    getReqConfig(parentAppId)
  )

const reauthenticateUser = ({
  accountName,
  scopeName,
  parentAppId,
  fingerprint,
}) => {
  const scope = scopeName === Constants.Scopes.ADMIN ? '' : accountName

  return http
    .post(
      Paths.reauthenticateUser(scope),
      { fingerprint },
      getReqConfig(parentAppId)
    )
    .then(response => {
      const { status, data } = response
      if (status !== 200) {
        return Promise.resolve(null)
      }
      return Promise.resolve(data)
    })
    .catch(() => Promise.resolve(null))
}

export const getUserInfo = ({ accountName, scopeName, parentAppId }) => {
  const scope = scopeName === Constants.Scopes.ADMIN ? '' : accountName

  return http
    .get(Paths.getUserInfo(scope), getReqConfig(parentAppId))
    .then(response => {
      const { status, data } = response
      if (status !== 200) {
        return Promise.resolve(null)
      }
      return Promise.resolve(data)
    })
    .catch(() => Promise.resolve(null))
}

const reauthenticateAndGetUserInfo = async ({
  fingerprintPromise,
  accountName,
  scopeName,
  parentAppId,
  isAdmin,
}) => {
  if (isAdmin) {
    const fingerprint = await fingerprintPromise
    await reauthenticateUser({
      accountName,
      scopeName,
      parentAppId,
      fingerprint,
    })
  }
  return await getUserInfo({ accountName, scopeName, parentAppId })
}

export const getInitialData = ({ accountName, scopeName, parentAppId }) => {
  const isAdmin = scopeName === Constants.Scopes.ADMIN

  const fingerprintPromise = getDeviceFingerprint()

  return Promise.all([
    getIdentityProviders({ accountName, scopeName, parentAppId }),
    reauthenticateAndGetUserInfo({
      fingerprintPromise,
      accountName,
      scopeName,
      parentAppId,
      isAdmin,
    }),
    isAdmin ? fingerprintPromise : Promise.resolve(null),
  ]).then(([identityProviders, userInfo, fingerprint]) =>
    Promise.resolve({ identityProviders, userInfo, fingerprint })
  )
}

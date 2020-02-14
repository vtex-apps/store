const TEN_MINUTES = 600000

const constants = {
  OAuthCallbackUrl: '/api/vtexid/oauth/finish?popup=false',
  OAuthPopupCallbackUrl:
    '/api/vtexid/pub/authentication/finish?sessionRedirect=false',
  ReCAPTCHA: {
    SiteKey: '6LejYzMUAAAAADEaWZnPjOBiyqxE7cvnKpC8kz5F',
    Size: 'invisible',
  },
  SessionDuration: TEN_MINUTES,
  Scopes: {
    ADMIN: 'ADMIN',
    STORE: 'STORE',
  },
  ApiAuthStatus: {
    Success: 'Success',
    WrongCredentials: 'WrongCredentials',
    InativeUser: 'InativeUser',
    BlockedUser: 'BlockedUser',
    MultipleAccount: 'MultipleAccount',
    Pending: 'Pending',
    CanceledKey: 'CanceledKey',
    InvalidToken: 'InvalidToken',
    Error: 'Error',
    CanceledByUser: 'CanceledByUser',
    WeakPassword: 'WeakPassword',
    RequiresMFA: 'RequiresMFA',
    RequiresPhoneRegistration: 'RequiresPhoneRegistration',
    InvalidMFAToken: 'InvalidMFAToken',
    MissingPhoneNumber: 'MissingPhoneNumber',
    InvalidMFAState: 'InvalidMFAState',
    CanRegisterPhoneNumber: 'CanRegisterPhoneNumber',
    InvalidPhoneNumber: 'InvalidPhoneNumber',
    RequiresMFAAuthenticator: 'RequiresMFAAuthenticator',
    PasswordAlreadyUsed: 'PasswordAlreadyUsed',
    ExpiredPassword: 'ExpiredPassword',
    InvalidEmail: 'InvalidEmail',
    InvalidRecaptcha: 'InvalidRecaptcha',
  },
}

export default constants

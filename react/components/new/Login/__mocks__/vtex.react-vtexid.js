import { Component } from 'react'

export const AuthServiceLazy = {
  RedirectLogout: ({ children }) => children({ action: () => {} }),

  LoginWithAccessKey: ({ children }) =>
    children({ state: { token: 'token' }, loading: true, action: () => {} }),

  LoginWithPassword: ({ children }) =>
    children({
      state: { email: 'email@vtex.com', password: 'password' },
      loading: true,
      action: () => {},
      validation: { validateEmail: () => true },
    }),

  SendAccessKey: ({ children }) =>
    children({
      state: { email: 'email@vtex.com' },
      loading: true,
      action: () => {},
      validation: { validateEmail: () => true },
    }),

  OAuthRedirect: ({ children }) =>
    children({ loading: true, action: () => {} }),

  OAuthPopup: ({ children }) =>
    children({ loading: true, action: () => {} }),

  SetPassword: ({ children }) =>
    children({
      state: { password: 'password', token: 'token' },
      loading: true,
      action: () => {},
      validation: { validatePassword: () => true },
    }),
}

const AuthStateLazy = jest.fn(({ children }) => children({ loading: false }))

AuthStateLazy.Token = jest.fn(({ children }) =>
  children({ value: 'value', setValue: () => {} })
)

AuthStateLazy.Password = jest.fn(({ children }) =>
  children({ value: 'value', setValue: () => {} })
)

AuthStateLazy.Email = jest.fn(({ children }) =>
  children({ value: 'value', setValue: () => {} })
)

AuthStateLazy.IdentityProviders = jest.fn(({ children }) =>
  children({
    value: {
      accessKey: true,
      password: true,
      oAuthProviders: [{ providerName: 'Google', className: '' }],
    },
  })
)

export { AuthStateLazy }

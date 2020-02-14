import * as jscookies from 'js-cookie'

const COOKIE_NAME = '_vua'
const COOKIE_EXPIRES = 365

const Cookies = jscookies.withConverter({
  read: (value, name) => {
    if (name === COOKIE_NAME) return window.atob(value)
  },
  write: (value, name) => {
    if (name === COOKIE_NAME) return window.btoa(value)
  },
})

export const get = () => {
  if (window && window.document && window.document.cookie) {
    try {
      const usersJson = Cookies.get(COOKIE_NAME)
      const users = JSON.parse(usersJson)
      if (!Array.isArray(users)) {
        Cookies.remove(COOKIE_NAME, { path: location.pathname })
        return []
      }
      return users
    } catch {
      Cookies.remove(COOKIE_NAME, { path: location.pathname })
      return []
    }
  }
  return []
}

export const set = userAccounts => {
  if (window && window.document && window.location) {
    Cookies.set(COOKIE_NAME, userAccounts, {
      expires: COOKIE_EXPIRES,
      path: location.pathname,
    })
  }
}

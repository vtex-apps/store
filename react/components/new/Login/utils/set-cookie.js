import { compose, map, fromPairs, split, tail } from 'ramda'
import Cookies from 'js-cookie'
/**
 * Set Cookie from the URL name=value and clean up the URL query params.
 * Used in the OAuth login.
 *
 * @param {String} url To set cookie and cleaned up.
 */
export const setCookie = (url) => {
  const { accountAuthCookieName, accountAuthCookieValue } = compose(
    fromPairs, map(split('=')), split('&'), tail
  )(url)
  if (accountAuthCookieName && accountAuthCookieValue) {
    Cookies.set(accountAuthCookieName, accountAuthCookieValue, { expires: 1, path: '/', secure: true })
    const cleanUrl = url.substring(0, url.indexOf('?'))
    window.history.replaceState({}, document.title, cleanUrl)
    location.assign(location.origin)
  }
}

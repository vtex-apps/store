import { useRef } from 'react'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { useRuntime } from 'vtex.render-runtime'

// Page view events for home, search and product pages are sent by their own wrappers!
const BLACKLIST_PAGES = ['store.home', 'store.search', 'store.product']

/** When you navigate to a new page, the route object will remain the one from the previous route.
 * So we save the ref on the first mount. After that, we wait for the first time route changes to send a page view with the correct title.
 * A possible better implementation for the future, is add a loading state in the route object.
 */

const PageViewPixel = ({ title }) => {
  const { push } = usePixel()
  const { route, page, account } = useRuntime()

  const routeRef = useRef(route)
  const isBlacklisted =
    BLACKLIST_PAGES.findIndex(elem => page.includes(elem)) >= 0

  if (routeRef.current !== route && !isBlacklisted) {
    routeRef.current = route
    const data = {
      event: 'pageView',
      pageTitle: title,
      pageUrl: location.href,
      referrer:
        document.referrer.indexOf(location.origin) === 0
          ? undefined
          : document.referrer,
      accountName: account,
    }
    push(data)
  }

  return null
}

export default PageViewPixel

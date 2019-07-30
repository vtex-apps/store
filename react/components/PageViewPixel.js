import { useRef } from 'react'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { useRuntime } from 'vtex.render-runtime'

// Page view events for home, search and product pages are sent by their own wrappers!
const BLACKLIST_PAGES = ['store.home', 'store.search', 'store.product']

const PageViewPixel = ({ title }) => {
  const { push } = usePixel()
  const { route, page, account } = useRuntime()

  const routeRef = useRef(route)

  if (
    routeRef.current !== route &&
    BLACKLIST_PAGES.findIndex(elem => page.includes(elem)) < 0
  ) {
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

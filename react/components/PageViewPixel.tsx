import { useMemo } from 'react'
import { useRuntime, canUseDOM } from 'vtex.render-runtime'

import useDataPixel from '../hooks/useDataPixel'

interface UsePageViewArgs {
  title?: string
  cacheKey?: string
  skip?: boolean
}

export const usePageView = ({ title, cacheKey, skip }: UsePageViewArgs = {}) => {
  const { route, account } = useRuntime()
  const pixelCacheKey = cacheKey || route.routeId

  const eventData = useMemo(() => {
    if (!canUseDOM || skip) {
      return null
    }

    return {
      event: 'pageView',
      pageTitle: title || document.title,
      pageUrl: location.href,
      referrer:
        document.referrer.indexOf(location.origin) === 0
          ? undefined
          : document.referrer,
      accountName: account,
      routeId: route && route.routeId ? route.routeId : '',
    }
  }, [account, title, canUseDOM, pixelCacheKey])

  useDataPixel(skip ? null : eventData, pixelCacheKey)
}

// Those pages already use the hook above (`usePageView`)
// They need to handle the pageView event because they set the page title async
const SKIP_PAGES = ['store.search', 'store.product']

/** When you navigate to a new page, the route object will remain the one from the previous route.
 * So we save the ref on the first mount. After that, we wait for the first time route changes to send a page view with the correct title.
 * A possible better implementation for the future, is add a loading state in the route object.
 */
const PageViewPixel = ({ title }: Partial<UsePageViewArgs>) => {
  const { route } = useRuntime()

  const skip = route && SKIP_PAGES.some(routeId => route.routeId.indexOf(routeId) === 0)
  usePageView({ title, skip })

  return null
}

export default PageViewPixel

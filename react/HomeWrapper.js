import React, { useMemo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { useRuntime } from 'vtex.render-runtime'
import SearchAction from 'vtex.structured-data/SearchAction'

import useDataPixel from './hooks/useDataPixel'

const HomeWrapper = ({ children }) => {
  const { account } = useRuntime()

  const pixelEvents = useMemo(() => {
    if (typeof document === 'undefined') {
      return null
    }
    return [
      {
        event: 'pageView',
        pageTitle: document.title,
        pageUrl: location.href,
        referrer:
          document.referrer.indexOf(location.origin) === 0
            ? undefined
            : document.referrer,
        accountName: account,
      },
      {
        event: 'pageInfo',
        eventType: 'homeView',
        accountName: account,
        pageTitle: document.title,
        pageUrl: location.href,
        pageCategory: 'Home',
      },
    ]
  }, [account])
  useDataPixel(pixelEvents, 'Home')

  return (
    <Fragment>
      <SearchAction />
      {children}
    </Fragment>
  )
}

HomeWrapper.propTypes = {
  children: PropTypes.element,
}

export default HomeWrapper

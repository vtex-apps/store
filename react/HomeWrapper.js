import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useRuntime } from 'vtex.render-runtime'

import useDataPixel from './hooks/useDataPixel'

const HomeWrapper = ({ children }) => {
  const { account } = useRuntime()

  const pixelEvents = useMemo(
    () =>
      typeof document !== 'undefined' && {
        event: 'pageInfo',
        eventType: 'homeView',
        accountName: account,
        pageTitle: document.title,
        pageUrl: location.href,
        pageCategory: 'Home',
      },
    [account]
  )

  useDataPixel(pixelEvents)

  return children
}

HomeWrapper.propTypes = {
  children: PropTypes.element,
}

export default HomeWrapper

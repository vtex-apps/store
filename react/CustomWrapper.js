import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Helmet, useRuntime } from 'vtex.render-runtime'

import useDataPixel from './hooks/useDataPixel'

const CustomWrapper = ({
  children,
  metaTitle,
  metaDescription,
  metaKeywords,
}) => {
  const { account } = useRuntime()

  const pixelEvents = useMemo(
    () => ({
      event: 'pageInfo',
      eventType: 'customView',
      accountName: account,
      pageTitle: document.title,
      pageUrl: location.href,
      pageCategory: 'Custom',
    }),
    []
  )

  useDataPixel(pixelEvents)

  return (
    <Fragment>
      <Helmet
        title={metaTitle}
        meta={[
          { name: 'description', content: metaDescription },
          { name: 'keywords', content: metaKeywords },
        ]}
      />
      {children}
    </Fragment>
  )
}

CustomWrapper.propTypes = {
  children: PropTypes.node,
  metaTitle: PropTypes.string,
  metaDescription: PropTypes.string,
  metaKeywords: PropTypes.string,
}

export default CustomWrapper

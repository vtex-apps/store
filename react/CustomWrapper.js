import React from 'react'
import PropTypes from 'prop-types'
import { Helmet, useRuntime } from 'vtex.render-runtime'

import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'

const CustomWrapper = ({
  children,
  metaTitle,
  metaDescription,
  metaKeywords,
}) => {
  const { account } = useRuntime()

  const getData = () => ({
    event: 'pageInfo',
    eventType: 'customView',
    accountName: account,
    pageTitle: document.title,
    pageUrl: location.href,
    pageCategory: 'Custom',
  })

  return (
    <DataLayerApolloWrapper loading={false} getData={getData}>
      <Helmet
        title={metaTitle}
        meta={[
          { name: 'description', content: metaDescription },
          { name: 'keywords', content: metaKeywords },
        ]}
      />
      {children}
    </DataLayerApolloWrapper>
  )
}

CustomWrapper.propTypes = {
  children: PropTypes.node,
  metaTitle: PropTypes.string,
  metaDescription: PropTypes.string,
  metaKeywords: PropTypes.string,
}

export default CustomWrapper

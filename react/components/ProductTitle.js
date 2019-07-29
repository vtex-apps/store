import React from 'react'
import { Helmet, useRuntime } from 'vtex.render-runtime'

const titleSeparator = ' - '

const STORE_APP = 'vtex.store'

const ProductTitle = ({ product }) => {
  const { getSettings } = useRuntime()
  const { titleTag, productName, metaTagDescription } = product || {}
  let title = titleTag || productName || ''

  const settings = getSettings(STORE_APP)

  if (settings) {
    const { storeName, titleTag: storeTitleTag } = settings
    const storeData = storeName || storeTitleTag
    if (storeData) {
      title += title ? titleSeparator + storeData : storeData
    }
  }

  return (
    <Helmet
      title={title}
      meta={[
        metaTagDescription && {
          name: 'description',
          content: metaTagDescription,
        },
      ].filter(Boolean)}
    />
  )
}

export default ProductTitle

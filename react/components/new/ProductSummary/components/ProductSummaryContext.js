import React, { createContext } from 'react'

const ProductSummaryContext = createContext(0)

const OriginalConsumer = ProductSummaryContext.Consumer
ProductSummaryContext.Consumer = function WrappedConsumer(props) {
  console.error(
    "If you are seeing this, a component it's using ProductSummaryContext from vtex.product-summary, which is deprecated. Please see the issue https://github.com/vtex-apps/store-issues#28 on how to migrate to the new component."
  )

  return <OriginalConsumer {...props} />
}

export default ProductSummaryContext

import React, { Fragment } from 'react'

import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import useCssHandles from '../../../CssHandles/useCssHandles'

const MAX_SIZE_DESCRIPTION = 120
const CSS_HANDLES = ['description']

const ProductSummaryDescription = () => {
  const {
    product: { description },
  } = useProductSummary()
  const handles = useCssHandles(CSS_HANDLES)

  if (!description) return <Fragment />

  const descriptionClasses = `${handles.description} c-muted-2 t-small`

  const descriptionTruncated =
    description.length > MAX_SIZE_DESCRIPTION
      ? `${description.substring(0, MAX_SIZE_DESCRIPTION)}...`
      : description

  return <span className={descriptionClasses}>{descriptionTruncated}</span>
}

export default ProductSummaryDescription

import React from 'react'
import PropTypes from 'prop-types'
import { path } from 'ramda'
import ProductName from '../../../StoreComponents/ProductName'
import useCssHandles from '../../../CssHandles/useCssHandles'

import ProductSummaryContextApp from '../../../ProductSummaryContext/ProductSummaryContext'
const { useProductSummary } = ProductSummaryContextApp

const CSS_HANDLES = [
  'nameContainer',
  'nameWrapper',
  'brandName',
  'skuName',
  'productReference',
  'productNameLoader',
]

const ProductSummaryName = ({ showFieldsProps }) => {
  const { product } = useProductSummary()
  const handles = useCssHandles(CSS_HANDLES)
  const productName = path(['productName'], product)
  // TODO: change ProductSummaryContext to have `selectedSku` field instead of `sku`
  const skuName = path(['sku', 'name'], product)
  const brandName = path(['brand'], product)

  const containerClasses = `${handles.nameContainer} flex items-start justify-center pv6`
  const wrapperClasses = `${handles.nameWrapper} overflow-hidden c-on-base f5`
  const brandNameClasses = `${handles.brandName} t-body`
  const skuNameClasses = `${handles.skuName} t-small`
  const loaderClasses = `${handles.productNameLoader} pt5 overflow-hidden`

  return (
    <div className={containerClasses}>
      <ProductName
        className={wrapperClasses}
        brandNameClass={brandNameClasses}
        skuNameClass={skuNameClasses}
        loaderClass={loaderClasses}
        productReferenceClass={handles.productReference}
        name={productName}
        skuName={skuName}
        brandName={brandName}
        {...showFieldsProps}
      />
    </div>
  )
}

ProductSummaryName.defaultProps = {
  showFieldsProps: {
    showProductReference: false,
    showBrandName: false,
    showSku: false,
  },
}

ProductSummaryName.propTypes = {
  /** Name schema props */
  showFieldsProps: PropTypes.object,
}

ProductSummaryName.getSchema = () => {
  return {
    title: 'admin/editor.productSummaryName.title',
    type: 'object',
    properties: {
      showFieldsProps: ProductName.schema,
    },
  }
}

export default ProductSummaryName

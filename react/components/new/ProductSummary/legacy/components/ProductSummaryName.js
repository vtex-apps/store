import React from 'react'
import PropTypes from 'prop-types'
import { path } from 'ramda'
import ProductName from '../../../StoreComponents/ProductName'

import { productShape } from '../../utils/propTypes'

const ProductSummaryName = ({
  product,
  showFieldsProps,
  containerClass,
  brandNameClass,
  skuNameClass,
}) => {
  const productName = path(['productName'], product)
  const skuName = path(['sku', 'name'], product)
  const brandName = path(['brand'], product)

  return (
    <div className={containerClass}>
      <ProductName
        className="overflow-hidden c-on-base"
        brandNameClass={brandNameClass}
        skuNameClass={skuNameClass}
        loaderClass="pt5 overflow-hidden"
        name={productName}
        skuName={skuName}
        brandName={brandName}
        {...showFieldsProps}
      />
    </div>
  )
}

ProductSummaryName.propTypes = {
  /** Product that owns the informations */
  product: productShape,
  /** Name schema props */
  showFieldsProps: PropTypes.object,
  /** Styles used in the container div */
  containerClass: PropTypes.string,
  /** Styles used in the brand name */
  brandNameClass: PropTypes.string,
}

export default ProductSummaryName

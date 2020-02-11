import React from 'react'
import PropTypes from 'prop-types'
import ProductBrand from '../../../StoreComponents/ProductBrand'

import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'

const DISPLAY_MODE = {
  LOGO: 'logo',
  TEXT: 'text',
}

const ProductSummaryBrand = ({
  displayMode,
  fallbackToText,
  height,
  excludeBrands,
  logoWithLink,
}) => {
  const { product } = useProductSummary()
  return (
    <ProductBrand
      displayMode={displayMode}
      fallbackToText={fallbackToText}
      height={height}
      excludeBrands={excludeBrands}
      logoWithLink={logoWithLink}
      brandName={product.brand}
      brandId={product.brandId}
    />
  )
}

ProductSummaryBrand.propTypes = {
  /** Whether it should be displayed as a logo or as a text */
  displayMode: PropTypes.oneOf(Object.values(DISPLAY_MODE)),
  /** Whether it should display the name of the brand if there is no logo */
  fallbackToText: PropTypes.bool,
  /** List of brands that should be hidden, if any */
  excludeBrands: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  /** Height of the logo */
  height: PropTypes.number,
  /** If the logo should have a link*/
  logoWithLink: PropTypes.bool,
}

export default ProductSummaryBrand
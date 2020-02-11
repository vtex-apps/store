import React from 'react'
import PropTypes from 'prop-types'
import { path, prop } from 'ramda'

import Spinner from '../../../Styleguide/Spinner'
import ProductPrice from '../../../StoreComponents/ProductPrice'

import { productShape } from '../../utils/propTypes'

const ProductSummaryPrice = ({
  product,
  showListPrice,
  showLabels,
  showInstallments,
  labelSellingPrice,
  labelListPrice,
  isLoading,
  containerClass,
  sellingPriceClass,
}) => {
  const commertialOffer = path(['sku', 'seller', 'commertialOffer'], product)

  if (isLoading) {
    return (
      <div className="flex items-end justify-end w-100 h1 pr6">
        <Spinner size={20} />
      </div>
    )
  }

  const sellingPrice = prop('Price', commertialOffer)

  return (
    <div className={containerClass}>
      {sellingPrice !== 0 && (
        <ProductPrice
          className="flex flex-column justify-start"
          listPriceContainerClass="pv1 normal c-muted-2"
          listPriceLabelClass="dib strike t-small t-mini"
          listPriceClass="dib ph2 strike t-small-ns t-mini"
          sellingPriceContainerClass="pt1 pb3 c-on-base"
          sellingPriceLabelClass="dib"
          sellingPriceClass={sellingPriceClass}
          savingsContainerClass="t-small-ns c-muted-2"
          savingsClass="dib"
          interestRateClass="dib pl2"
          installmentContainerClass="t-small-ns c-muted-2"
          listPrice={prop('ListPrice', commertialOffer)}
          sellingPrice={prop('Price', commertialOffer)}
          installments={prop('Installments', commertialOffer)}
          showListPrice={showListPrice}
          showLabels={showLabels}
          showInstallments={showInstallments}
          labelSellingPrice={labelSellingPrice}
          labelListPrice={labelListPrice}
        />
      )}
    </div>
  )
}

ProductSummaryPrice.propTypes = {
  /** Product that owns the informations */
  product: productShape,
  /** Set the product list price's visibility */
  showListPrice: PropTypes.bool,
  /** Set pricing labels' visibility */
  showLabels: PropTypes.bool,
  /** Set installments' visibility */
  showInstallments: PropTypes.bool,
  /** Text of selling Price's label */
  labelSellingPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  /** Text of selling Price's label */
  labelListPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  /** Defines if the loading spinner is shown */
  isLoading: PropTypes.bool,
  /** Styles used in the container div */
  containerClass: PropTypes.string,
  /** Styles used in the selling price */
  sellingPriceClass: PropTypes.string,
}

export default ProductSummaryPrice

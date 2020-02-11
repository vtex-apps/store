import React from 'react'
import PropTypes from 'prop-types'
import { path, prop, flatten, pluck } from 'ramda'
import classNames from 'classnames'
import Spinner from '../../../Styleguide/Spinner'
import ProductPrice from '../../../StoreComponents/ProductPrice'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'

import useCssHandles from '../../../CssHandles/useCssHandles'

const CSS_HANDLES = [
  'priceContainer',
  'productPriceClass',
  'listPriceContainer',
  'listPriceLabel',
  'listPrice',
  'sellingPriceContainer',
  'sellingPriceLabel',
  'sellingPrice',
  'savingsContainer',
  'savings',
  'interestRate',
  'installmentContainer',
  'listPriceRange',
  'sellingPriceRange',
  'priceLoading',
]

const isAvailableProduct = price => price !== 0

const getPrices = (product, attribute) => {
  if (!product || (!product.items && !product.priceRange)) {
    return []
  }
  if (product.priceRange) {
    const values = product.priceRange[attribute]
    return values ? [values.lowPrice, values.highPrice] : []
  }

  // No priceRange resolver provided, use sku information
  const sellers = flatten(pluck('sellers', product.items))
  const offerAttribute = attribute === 'sellingPrice' ? 'Price' : 'ListPrice'
  const prices = sellers.map(path(['commertialOffer', offerAttribute]))
  const availableProductsPrices = prices.filter(isAvailableProduct)
  return availableProductsPrices
}

const ProductSummaryPrice = ({
  showListPrice,
  showSellingPriceRange,
  showLabels,
  showInstallments,
  showDiscountValue,
  labelSellingPrice,
  labelListPrice,
  showBorders,
  showListPriceRange,
}) => {
  const { product, isLoading } = useProductSummary()
  const handles = useCssHandles(CSS_HANDLES)
  // TODO: change ProductSummaryContext to have `selectedSku` field instead of `sku`
  const commertialOffer = path(['sku', 'seller', 'commertialOffer'], product)

  if (isLoading) {
    return (
      <div
        className={`${handles.priceLoading} flex items-end justify-end w-100 h1 pr6`}
      >
        <Spinner size={20} />
      </div>
    )
  }

  const priceClasses = {
    containerClass: classNames('flex flex-column justify-end items-center', {
      [`${handles.priceContainer} pv5`]: !showBorders,
    }),
    sellingPriceClass: `${handles.sellingPrice} dib ph2 t-body t-heading-5-ns`,
  }

  const sellingPriceList = showSellingPriceRange
    ? getPrices(product, 'sellingPrice')
    : []
  const listPriceList = showListPriceRange
    ? getPrices(product, 'listPrice')
    : []
  const sellingPrice = prop('Price', commertialOffer)

  return (
    <div className={priceClasses.containerClass}>
      {sellingPrice !== 0 && (
        <ProductPrice
          className={`${handles.productPriceClass} flex flex-column justify-start`}
          listPriceContainerClass={`${handles.listPriceContainer} pv1 normal c-muted-2`}
          listPriceLabelClass={`${handles.listPriceLabel} dib strike t-small t-mini`}
          listPriceClass={`${handles.listPrice} dib ph2 strike t-small-ns t-mini`}
          sellingPriceContainerClass={`${handles.sellingPriceContainer} pt1 pb3 c-on-base`}
          sellingPriceLabelClass={`${handles.sellingPriceLabel} dib`}
          sellingPriceClass={priceClasses.sellingPriceClass}
          savingsContainerClass={`${handles.savingsContainer} t-small-ns c-muted-2`}
          savingsClass={`${handles.savings} dib`}
          interestRateClass={`${handles.interestRate} dib pl2`}
          installmentContainerClass={`${handles.installmentContainer} t-small-ns c-muted-2`}
          listPrice={prop('ListPrice', commertialOffer)}
          sellingPriceList={sellingPriceList}
          listPriceRangeClass={`${handles.listPriceRange} dib ph2 t-small-ns strike`}
          sellingPriceRangeClass={`${handles.sellingPriceRange} dib ph2 t-small-ns`}
          sellingPrice={prop('Price', commertialOffer)}
          installments={prop('Installments', commertialOffer)}
          showListPrice={showListPrice}
          showSellingPriceRange={showSellingPriceRange}
          showLabels={showLabels}
          showInstallments={showInstallments}
          labelSellingPrice={labelSellingPrice}
          labelListPrice={labelListPrice}
          listPriceList={listPriceList}
          showListPriceRange={showListPriceRange}
          showSavings={showDiscountValue}
        />
      )}
    </div>
  )
}

ProductSummaryPrice.propTypes = {
  /** Set the product selling price range visibility */
  showSellingPriceRange: PropTypes.bool,
  /** Set the product list price's visibility */
  showListPrice: PropTypes.bool,
  /** Set the product list price range visibility */
  showListPriceRange: PropTypes.bool,
  /** Set pricing labels' visibility */
  showLabels: PropTypes.bool,
  /** Set installments' visibility */
  showInstallments: PropTypes.bool,
  /** Set savings' visibility*/
  showDiscountValue: PropTypes.bool,
  /** Text of selling Price's label */
  labelSellingPrice: PropTypes.string,
  /** Text of list Price's label */
  labelListPrice: PropTypes.string,
  /** Set installments' visibility */
  showBorders: PropTypes.bool,
}

ProductSummaryPrice.defaultProps = {
  showSellingPriceRange: false,
  showDiscountValue: false,
  showListPriceRange: false,
  showListPrice: true,
  showInstallments: true,
  showLabels: true,
  labelSellingPrice: '',
  labelListPrice: '',
  showBorders: false,
}

ProductSummaryPrice.schema = {
  title: 'admin/editor.productSummaryPrice.title',
  description: 'admin/editor.productSummaryPrice.description',
  type: 'object',
  properties: {
    showListPrice: {
      type: 'boolean',
      title: 'admin/editor.productSummaryPrice.showListPrice.title',
      default: ProductSummaryPrice.defaultProps.showListPrice,
      isLayout: true,
    },
    showSellingPriceRange: {
      type: 'boolean',
      title: 'admin/editor.productSummaryPrice.showSellingPriceRange.title',
      default: ProductSummaryPrice.defaultProps.showSellingPriceRange,
      isLayout: true,
    },
    showListPriceRange: {
      type: 'boolean',
      title: 'admin/editor.productSummaryPrice.showListPriceRange.title',
      default: ProductSummaryPrice.defaultProps.showListPrice,
      isLayout: true,
    },
    showInstallments: {
      type: 'boolean',
      title: 'admin/editor.productSummaryPrice.showInstallments.title',
      default: ProductSummaryPrice.defaultProps.showInstallments,
      isLayout: true,
    },
    showDiscountValue: {
      type: 'boolean',
      title: 'admin/editor.productSummaryPrice.showDiscountValue.title',
      default: ProductSummaryPrice.defaultProps.showDiscountValue,
    },
    showLabels: {
      type: 'boolean',
      title: 'admin/editor.productSummaryPrice.showLabels.title',
      default: ProductSummaryPrice.defaultProps.showLabels,
      isLayout: true,
    },
    showBorders: {
      type: 'boolean',
      title: 'admin/editor.productSummaryPrice.showBorders.title',
      default: ProductSummaryPrice.defaultProps.showBorders,
      isLayout: true,
    },
  },
}

export default ProductSummaryPrice

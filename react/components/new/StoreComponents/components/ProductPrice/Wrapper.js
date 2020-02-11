import React, { useContext } from 'react'
import { ProductContext } from 'vtex.product-context'
import { path, isEmpty, has } from 'ramda'

import ProductPrice from './index'

const styles = {
  'vtex-price-list__container--loader': {
    x: 0,
    width: '7.219em',
    height: '0.56em',
  },
  'vtex-price-selling__label--loader': {
    x: 0,
    y: '2em',
    width: '2.85em',
    height: '1.08em',
  },
  'vtex-price-selling--loader': {
    x: '3.25em',
    y: '0.86em',
    width: '14.572em',
    height: '2.176em',
  },
  'vtex-price-installments--loader': {
    x: 0,
    y: '3.75em',
    width: '12em',
    height: '0.825em',
  },
  'vtex-price-savings--loader': {
    x: 0,
    y: '5em',
    width: '10em',
    height: '0.686em',
  },
}

const isAvailable = commertialOffer =>
  Number.isNaN(+path(['AvailableQuantity'], commertialOffer)) ||
  path(['AvailableQuantity'], commertialOffer) > 0

const ProductPriceWrapper = ({
  labelSellingPrice,
  showListPrice,
  showInstallments,
  showLabels,
  showSavings,
  ...props
}) => {
  const valuesFromContext = useContext(ProductContext)

  const {
    className,
    listPriceContainerClass,
    listPriceLabelClass,
    listPriceClass,
    sellingPriceContainerClass,
    sellingPriceLabelClass,
    sellingPriceClass,
    savingsContainerClass,
    savingsClass,
    interestRateClass,
    installmentContainerClass,
    installmentClass,
    loaderClass,
    listPrice,
    sellingPrice,
    installments,
  } = props

  const productPriceProps = () => {
    if (!valuesFromContext || isEmpty(valuesFromContext) || (!has('query', props) && !has('params', props))) {
      return {
        ...props,
        labelSellingPrice,
        showListPrice,
        showInstallments,
        showLabels,
        showSavings,
        showProductPrice: true,
      }
    }

    const { selectedItem } = valuesFromContext
    const commertialOffer = path(['sellers', 0, 'commertialOffer'], selectedItem)

    return {
      ...props,
      styles: props.styles || styles,
      className: className || '',
      listPriceContainerClass: listPriceContainerClass || 't-small-s t-small-ns c-muted-2 mb2',
      sellingPriceLabelClass: sellingPriceLabelClass || 't-heading-6-s t-heading-5-ns dib',
      listPriceLabelClass: listPriceLabelClass || 'dib strike',
      listPriceClass: listPriceClass || 'ph2 dib strike',
      sellingPriceContainerClass: sellingPriceContainerClass || 'pv1 b c-on-base',
      sellingPriceClass: sellingPriceClass || 't-heading-2-s dib ph2',
      installmentContainerClass: installmentContainerClass || 't-mini-s t-small-ns c-on-base',
      installmentClass: installmentClass || 't-body',
      interestRateClass: interestRateClass || 'dib ph2',
      savingsContainerClass: savingsContainerClass || 'c-success mt3',
      savingsClass:  savingsClass || 'dib t-small',
      loaderClass: loaderClass || 'h4-s mw6-s pt2-s',
      listPrice: listPrice || path(['ListPrice'], commertialOffer),
      sellingPrice: sellingPrice || path(['Price'], commertialOffer),
      installments: installments || path(['Installments'], commertialOffer),
      labelSellingPrice,
      showLabels,
      showInstallments,
      showListPrice,
      showSavings,
      showProductPrice: isAvailable(commertialOffer),
    }
  }

  const { showProductPrice, ...priceProps } = productPriceProps()

  if (!showProductPrice) {
    return null
  }

  return (
    <ProductPrice { ...priceProps } />
  )
}

ProductPriceWrapper.schema = {
  title: 'admin/editor.productPrice.title',
  description: 'admin/editor.productPrice.description',
  type: 'object',
  properties: {
    labelSellingPrice: {
      type: 'string',
      title: 'admin/editor.productPrice.labelSellingPrice',
      default: ProductPrice.defaultProps.labelSellingPrice,
      isLayout: false,
    },
    labelListPrice: {
      type: 'string',
      title: 'admin/editor.productPrice.labelListPrice',
      default: ProductPrice.defaultProps.labelListPrice,
      isLayout: false,
    },
    showSellingPriceRange: {
      type: 'boolean',
      title: 'admin/editor.productPrice.showSellingPriceRange',
      default: ProductPrice.defaultProps.showSellingPriceRange,
      isLayout: true,
    },
    showListPriceRange: {
      type: 'boolean',
      title: 'admin/editor.productPrice.showListPriceRange',
      default: ProductPrice.defaultProps.showListPriceRange,
      isLayout: true,
    },
    showListPrice: {
      type: 'boolean',
      title: 'admin/editor.productPrice.showListPrice',
      default: ProductPrice.defaultProps.showListPrice,
      isLayout: true,
    },
    showLabels: {
      type: 'boolean',
      title: 'admin/editor.productPrice.showLabels',
      default: ProductPrice.defaultProps.showLabels,
      isLayout: true,
    },
    showInstallments: {
      type: 'boolean',
      title: 'admin/editor.productPrice.showInstallments',
      default: ProductPrice.defaultProps.showInstallments,
      isLayout: true,
    },
    showSavings: {
      type: 'boolean',
      title: 'admin/editor.productPrice.showSavings',
      default: ProductPrice.defaultProps.showSavings,
      isLayout: true,
    },
  },
}

export default ProductPriceWrapper

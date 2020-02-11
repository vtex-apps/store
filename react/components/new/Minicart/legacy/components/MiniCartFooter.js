import React, { Fragment, memo } from 'react'
import classNames from 'classnames'
import ProductPrice from '../../../StoreComponents/ProductPrice'
import Button from '../../../Styleguide/Button'
import Spinner from '../../../Styleguide/Spinner'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { useRuntime, ExtensionPoint } from 'vtex.render-runtime'

import { MiniCartPropTypes } from '../utils/propTypes'
import minicart from '../minicart.css'

const MiniCartFooter = ({
  shippingCost,
  isSizeLarge,
  isUpdating,
  totalValue,
  buttonLabel,
  buttonLink,
  showDiscount,
  discount,
  labelDiscount,
  showShippingCost,
}) => {
  const { rootPath = '' } = useRuntime()
  const handleClickButton = () => location.assign(rootPath + buttonLink)

  const priceAndDiscountClasses = classNames(
    `${minicart.contentDiscount} w-100 flex justify-end items-center mb3`,
    {
      pv3: isSizeLarge,
    }
  )

  const checkoutButtonClasses = classNames({
    'bb bw4 bw2-m b--transparent': isSizeLarge,
  })

  const shouldShowShippingCost = showShippingCost && shippingCost > 0

  const footerClasses = classNames(
    `${minicart.contentFooter} w-100 bg-base pa4 pv5 flex flex-column items-end`,
    {
      'bt b--muted-3': shouldShowShippingCost || isSizeLarge,
    }
  )

  return (
    <Fragment>
      {shouldShowShippingCost && (
        <div
          className={`${minicart.footerShippingPriceContainer} flex items-center justify-between ma5`}
        >
          <div
            className={`${minicart.footerShippingPriceLabelContainer} t-body c-muted-1`}
          >
            <FormattedMessage id="store/minicart.shipping-cost" />
          </div>
          <ProductPrice
            sellingPriceClass="t-heading-5-ns b c-on-base ph2 dib"
            sellingPrice={shippingCost}
            showLabels={false}
            showListPrice={false}
          />
        </div>
      )}
      <div
        className={minicart.footerSpacer}
        style={{
          marginTop: 'auto',
        }}
      />
      <ExtensionPoint id="sandbox" />
      <div className={footerClasses}>
        {!isUpdating && showDiscount && discount > 0 && (
          <div className={priceAndDiscountClasses}>
            <span
              className={`${minicart.labelDiscountText} ttl c-action-primary`}
            >
              {labelDiscount}
            </span>
            <ProductPrice
              sellingPriceClass="c-action-primary t-body ph2 dib"
              sellingPrice={discount}
              listPrice={discount}
              showLabels={false}
              showListPrice={false}
            />
          </div>
        )}
        <div className={`${minicart.contentPrice} mb3`}>
          {isUpdating ? (
            <Spinner size={18} />
          ) : (
            <ProductPrice
              sellingPriceClass="t-heading-5-ns c-on-base b ph2 dib"
              sellingPrice={totalValue}
              listPrice={totalValue}
              showLabels={false}
              showListPrice={false}
            />
          )}
        </div>
        <div className={checkoutButtonClasses}>
          <Button variation="primary" size="small" onClick={handleClickButton}>
            {buttonLabel}
          </Button>
        </div>
      </div>
    </Fragment>
  )
}

MiniCartFooter.propTypes = {
  shippingCost: PropTypes.number,
  isSizeLarge: PropTypes.bool,
  isUpdating: PropTypes.bool,
  totalValue: PropTypes.number.isRequired,
  buttonLink: PropTypes.string,
  buttonLabel: PropTypes.string.isRequired,
  showDiscount: MiniCartPropTypes.showDiscount,
  discount: PropTypes.number,
  labelDiscount: PropTypes.string,
  showShippingCost: MiniCartPropTypes.showShippingCost,
}

export default memo(MiniCartFooter)

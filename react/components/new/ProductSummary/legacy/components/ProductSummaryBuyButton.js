import React from 'react'
import BuyButton from '../../../StoreComponents/BuyButton'
import { equals, path } from 'ramda'
import classNames from 'classnames'
import IOMessage from '../../../NativeTypes/IOMessage'
import { useRuntime } from 'vtex.render-runtime'

import displayButtonTypes from '../../utils/displayButtonTypes'
import productSummary from '../../productSummary.css'

const ProductSummaryBuyButton = ({
  product,
  displayBuyButton,
  isOneClickBuy,
  buyButtonText,
  isHovering,
  containerClass,
}) => {
  const {
    hints: { mobile },
  } = useRuntime()

  const hoverBuyButton =
    equals(displayBuyButton, displayButtonTypes.DISPLAY_ALWAYS.value) ||
    !equals(displayBuyButton, displayButtonTypes.DISPLAY_ON_HOVER.value) ||
    (isHovering && !mobile)

  const showBuyButton =
    !equals(displayBuyButton, displayButtonTypes.DISPLAY_NONE.value) &&
    !(
      equals(displayBuyButton, displayButtonTypes.DISPLAY_ON_HOVER.value) &&
      mobile
    )

  const buyButtonClasses = classNames(
    `${productSummary.buyButton} center mw-100`,
    {
      [productSummary.isHidden]: !hoverBuyButton,
    }
  )

  // TODO: change ProductSummaryContext to have `selectedSku` field instead of `sku`
  const selectedItem = product.sku
  const selectedSeller = path(['seller'], selectedItem)
  const isAvailable =
    selectedSeller &&
    selectedSeller.commertialOffer &&
    selectedSeller.commertialOffer.AvailableQuantity > 0
  const skuItems = BuyButton.mapCatalogItemToCart({
    product,
    selectedItem,
    selectedSeller,
    selectedQuantity: 1,
  })

  return (
    showBuyButton && (
      <div className={containerClass}>
        <div className={buyButtonClasses}>
          <BuyButton
            available={isAvailable}
            skuItems={skuItems}
            isOneClickBuy={isOneClickBuy}
          >
            <IOMessage id={buyButtonText} />
          </BuyButton>
        </div>
      </div>
    )
  )
}

export default ProductSummaryBuyButton

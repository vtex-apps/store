import React from 'react'
import PropTypes from 'prop-types'
import BuyButton from '../../../StoreComponents/BuyButton'
import { withRuntimeContext } from 'vtex.render-runtime'
import { equals, path } from 'ramda'
import classnames from 'classnames'
import IOMessage from '../../../NativeTypes/IOMessage'

import ProductSummaryContextApp from '../../../ProductSummaryContext/ProductSummaryContext'
const { useProductSummary } = ProductSummaryContextApp
import displayButtonTypes, {
  getDisplayButtonNames,
  getDisplayButtonValues,
} from '../../utils/displayButtonTypes'

import productSummary from '../../productSummary.css'
import useCssHandles from '../../../CssHandles/useCssHandles'

const ALWAYS_GO_TO_PRODUCT = 'alwaysGoToProduct'
const DEFAULT_BUTTON_BEHAVIOR = 'default'
const BUY_BUTTON_BEHAVIOR_OPTIONS = [
  ALWAYS_GO_TO_PRODUCT,
  DEFAULT_BUTTON_BEHAVIOR,
]
const CSS_HANDLES = ['buyButton', 'buyButtonContainer']

const ProductSummaryBuyButton = ({
  displayBuyButton,
  isOneClickBuy,
  buyButtonText,
  customToastURL,
  runtime: {
    hints: { mobile },
  },
  buyButtonBehavior,
  isHovering,
}) => {
  const { product, selectedItem, selectedQuantity } = useProductSummary()
  const handles = useCssHandles(CSS_HANDLES)

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

  const buyButtonClasses = classnames(
    handles.buyButton,
    'center mw-100',
    {
      [productSummary.isHidden]: !hoverBuyButton,
    }
  )

  const containerClass = classnames(
    handles.buyButtonContainer,
    'pv3 w-100 db'
  )

  const selectedSeller = path(['seller'], selectedItem)
  const isAvailable =
    selectedSeller &&
    selectedSeller.commertialOffer &&
    selectedSeller.commertialOffer.AvailableQuantity > 0
  const skuItems = BuyButton.mapCatalogItemToCart({
    product,
    selectedItem,
    selectedSeller,
    selectedQuantity,
  })

  const { items = [] } = product
  // if the item is not available the behavior is just show the disabled BuyButton,
  // but you still can go to the product page clicking in the summary
  const shouldBeALink =
    (items.length !== 1 || buyButtonBehavior !== DEFAULT_BUTTON_BEHAVIOR) &&
    isAvailable

  return (
    showBuyButton && (
      <div
        className={containerClass}
        data-testid="product-summary__buy-button-container"
      >
        <div className={buyButtonClasses}>
          <BuyButton
            skuItems={skuItems}
            available={isAvailable}
            isOneClickBuy={isOneClickBuy}
            customToastURL={customToastURL}
            shouldAddToCart={!shouldBeALink}
          >
            <IOMessage id={buyButtonText} />
          </BuyButton>
        </div>
      </div>
    )
  )
}

ProductSummaryBuyButton.propTypes = {
  /** Runtime context */
  runtime: PropTypes.shape({
    hints: PropTypes.shape({
      /** Indicates if is on a mobile device */
      mobile: PropTypes.bool,
    }),
  }),
  /** What the buy button should do when you click it, if you pass default it will add to cart only if there is only one SKU of that product */
  buyButtonBehavior: PropTypes.oneOf(BUY_BUTTON_BEHAVIOR_OPTIONS),
  /** Should redirect to checkout after clicking on buy */
  isOneClickBuy: PropTypes.bool,
  /** Custom buy button text */
  buyButtonText: PropTypes.string,
  /** Defines the display mode of buy button */
  displayBuyButton: PropTypes.oneOf(getDisplayButtonValues()),
  /** A custom URL for the `VIEW CART` button inside the toast created by BuyButton */
  customToastURL: PropTypes.string,
}

ProductSummaryBuyButton.defaultProps = {
  displayBuyButton: displayButtonTypes.DISPLAY_ALWAYS.value,
  isOneClickBuy: false,
  buyButtonBehavior: DEFAULT_BUTTON_BEHAVIOR,
}

ProductSummaryBuyButton.getSchema = () => {
  return {
    title: 'admin/editor.productSummaryBuyButton.title',
    type: 'object',
    properties: {
      isOneClickBuy: {
        type: 'boolean',
        title: 'admin/editor.productSummary.isOneClickBuy.title',
        default: false,
        isLayout: true,
      },
      displayBuyButton: {
        title: 'admin/editor.productSummary.displayBuyButton.title',
        type: 'string',
        enum: getDisplayButtonValues(),
        enumNames: getDisplayButtonNames(),
        default: displayButtonTypes.DISPLAY_ALWAYS.value,
        isLayout: true,
      },
    },
  }
}

export default withRuntimeContext(ProductSummaryBuyButton)

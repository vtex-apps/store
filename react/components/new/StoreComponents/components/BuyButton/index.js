import PropTypes from 'prop-types'
import React, { useContext, useCallback, useState, useEffect } from 'react'
import { intlShape, FormattedMessage } from 'react-intl'
import { path } from 'ramda'
import ContentLoader from 'react-content-loader'
import { useRuntime } from 'vtex.render-runtime'
import PWAContext from '../../../StoreResources/PWAContext'
const { usePWA } = PWAContext
import useCssHandles from '../../../CssHandles/useCssHandles'

import useProduct from '../../../ProductContext/useProduct'
import ProductDispatchContext from '../../../ProductContext/ProductDispatchContext'
const { useProductDispatch } = ProductDispatchContext

import Button from '../../../Styleguide/Button'
import ToastContext from '../../../Styleguide/ToastContext'
import Tooltip from '../../../Styleguide/Tooltip'
import useMarketingSessionParams from './hooks/useMarketingSessionParams'

const CONSTANTS = {
  SUCCESS_MESSAGE_ID: 'store/buybutton.buy-success',
  SELECT_SKU_ERROR_ID: 'store/buybutton.select-sku-variations',
  OFFLINE_BUY_MESSAGE_ID: 'store/buybutton.buy-offline-success',
  DUPLICATE_CART_ITEM_ID: 'store/buybutton.buy-success-duplicate',
  ERROR_MESSAGE_ID: 'store/buybutton.add-failure',
  SEE_CART_ID: 'store/buybutton.see-cart',
  TOAST_TIMEOUT: 3000,
}

const CSS_HANDLES = ['buyButtonContainer', 'buyButtonText']

const isTooltipNeeded = ({
  showTooltipOnSkuNotSelected,
  skuSelector,
}) => {
  if (showTooltipOnSkuNotSelected && !skuSelector.areAllVariationsSelected) {
    return {
      showTooltip: true,
      labelId: CONSTANTS.SELECT_SKU_ERROR_ID,
    }
  }
  return {
    showTooltip: false,
  }
}

const skuItemToMinicartItem = item => {
  return {
    // Important for the mutation
    id: item.skuId,
    seller: item.seller,
    options: item.options,
    quantity: item.quantity,

    // Fields for optmistic cart
    sellingPrice: item.price,
    skuName: item.variant,
    detailUrl: item.detailUrl,
    imageUrl: item.imageUrl,
    name: item.name,
    listPrice: item.listPrice,
    assemblyOptions: item.assemblyOptions,
    sellingPriceWithAssemblies: item.sellingPriceWithAssemblies,

    // Fields for Analytics
    brand: item.brand,
    category: item.category,
    productRefId: item.productRefId,
  }
}

const useCallCartFinishIfPending = (orderFormContext, isAddingToCart, addToCartAndFinish) => {
  const orderFormLoading = orderFormContext && orderFormContext.loading
  useEffect(() => {
    if (!orderFormLoading && isAddingToCart) {
      addToCartAndFinish()
    }
  }, [orderFormLoading])
}

/**
 * BuyButton Component.
 * Adds a list of sku items to the cart.
 */
export const BuyButton = ({
  intl,
  large,
  addToCart,
  skuItems,
  onAddStart,
  onAddFinish,
  setMinicartOpen,
  available = true,
  orderFormContext,
  isOneClickBuy = false,
  children,
  disabled: disabledProp,
  shouldAddToCart = true,
  shouldOpenMinicart = false,
  showTooltipOnSkuNotSelected = true,
  checkoutUrl,
  customToastURL = checkoutUrl,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const [isAddingToCart, setAddingToCart] = useState(false)
  const { showToast } = useContext(ToastContext)
  const {
    skuSelector = {
      areAllVariationsSelected: true,
    },
  } = useProduct()
  const dispatch = useProductDispatch()
  const { settings = {}, showInstallPrompt } = usePWA() || {}
  const { promptOnCustomEvent } = settings
  const translateMessage = useCallback(id => intl.formatMessage({ id: id }), [
    intl,
  ])
  const orderFormItems = path(['orderForm', 'items'], orderFormContext)
  const { utmParams, utmiParams } = useMarketingSessionParams()

  const resolveToastMessage = (success, isNewItem) => {
    if (!success) return translateMessage(CONSTANTS.ERROR_MESSAGE_ID)
    if (!isNewItem) return translateMessage(CONSTANTS.DUPLICATE_CART_ITEM_ID)

    const isOffline = window && window.navigator && !window.navigator.onLine
    const checkForOffline = !isOffline
      ? translateMessage(CONSTANTS.SUCCESS_MESSAGE_ID)
      : translateMessage(CONSTANTS.OFFLINE_BUY_MESSAGE_ID)

    return checkForOffline
  }

  const toastMessage = ({ success, isNewItem }) => {
    const message = resolveToastMessage(success, isNewItem)

    const action = success
      ? {
        label: translateMessage(CONSTANTS.SEE_CART_ID),
        href: customToastURL,
      }
      : undefined

    showToast({ message, action })
  }

  const { rootPath = '' } = useRuntime()
  const fullCheckoutUrl = rootPath + checkoutUrl

  const beforeAddToCart = event => {
    event.stopPropagation()
    event.preventDefault()

    setAddingToCart(true)
    onAddStart && onAddStart()
  }

  const addToCartAndFinish = async () => {
    let showToastMessage
    try {
      const minicartItems = skuItems.map(skuItemToMinicartItem)
      const localStateMutationResult = !isOneClickBuy
        ? await addToCart(minicartItems)
        : null
      const linkStateItems =
        localStateMutationResult && localStateMutationResult.data.addToCart
      const callOrderFormDirectly = !linkStateItems

      let success = null
      if (callOrderFormDirectly) {
        const variables = {
          orderFormId: orderFormContext.orderForm.orderFormId,
          items: skuItems.map(item => ({
            id: item.skuId,
            seller: item.seller,
            options: item.options,
            quantity: item.quantity,
          })),
          ...(utmParams ? {utmParams} : {}),
          ...(utmiParams ? {utmiParams} : {}),
        }
        const mutationRes = await orderFormContext.addItem({ variables })
        const { items } = mutationRes.data.addItem

        success = skuItems.filter(
          skuItem =>
            !!items.find(
              ({ id, seller }) =>
                id === skuItem.skuId && seller === skuItem.seller
            )
        )
        await orderFormContext.refetch().catch(() => null)
      }

      const addedItem =
        (linkStateItems &&
          skuItems.filter(
            skuItem =>
              !!linkStateItems.find(
                ({ id, seller }) =>
                  id === skuItem.skuId && seller === skuItem.seller
              )
          )) ||
        success

      const foundItem =
        addedItem.length &&
        orderFormItems &&
        orderFormItems.filter(
          item =>
            item.id === addedItem[0].skuId &&
            item.seller === addedItem[0].seller
        ).length > 0

      success = addedItem

      showToastMessage = () =>
        toastMessage({
          success: success && success.length >= 1,
          isNewItem: !foundItem,
        })

      /* PWA */
      if (promptOnCustomEvent === 'addToCart' && showInstallPrompt) {
        showInstallPrompt()
      }

      shouldOpenMinicart && !isOneClickBuy && setMinicartOpen(true)
    } catch (err) {
      console.error(err)
      showToastMessage = () => toastMessage(false)
    }

    setTimeout(() => {
      setAddingToCart(false)
      showToastMessage()
      if (isOneClickBuy) {
        location.assign(fullCheckoutUrl)
      }
      onAddFinish && onAddFinish()
    }, 500)
  }

  const handleAddToCart = async event => {
    beforeAddToCart(event)
    await addToCartAndFinish()
  }

  useCallCartFinishIfPending(orderFormContext, isAddingToCart, addToCartAndFinish)

  const handleClick = e => {
    if (dispatch) {
      dispatch({ type: 'SET_BUY_BUTTON_CLICKED', args: { clicked: true } })
    }

    if (skuSelector.areAllVariationsSelected && shouldAddToCart) {
      if (orderFormContext && orderFormContext.loading) {
        // Just call the before add to cart function and the useEffect hook will call the finish part when apropriate
        beforeAddToCart(e)
      } else {
        handleAddToCart(e)
      }
    }
  }

  if (!skuItems) {
    return <ContentLoader />
  }

  const disabled = disabledProp || !available
  const unavailableLabel = (
    <FormattedMessage id="store/buyButton-label-unavailable">
      {message => <span className={handles.buyButtonText}>{message}</span>}
    </FormattedMessage>
  )

  const ButtonWithLabel = <Button
    block={large}
    disabled={disabled}
    onClick={handleClick}
    isLoading={isAddingToCart}
  >
    {available ? children : unavailableLabel}
  </Button>

  const { showTooltip, labelId } = isTooltipNeeded({
    showTooltipOnSkuNotSelected,
    skuSelector,
  })

  const tooltipLabel = showTooltip &&
    <span className={handles.errorMessage}>
      <FormattedMessage id={labelId} />
    </span>

  return !showTooltip ? (
    ButtonWithLabel
  ) : (
      <Tooltip trigger="click" label={tooltipLabel}>
        {ButtonWithLabel}
      </Tooltip>
    )
}

BuyButton.propTypes = {
  /** SKU Items to be added to the cart */
  skuItems: PropTypes.arrayOf(
    PropTypes.shape({
      /** Specification of which product will be added to the cart */
      skuId: PropTypes.string.isRequired,
      /** Quantity of the product sku to be added to the cart */
      quantity: PropTypes.number.isRequired,
      /** Which seller is being referenced by the button */
      seller: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      /* Sku name */
      name: PropTypes.string.isRequired,
      /* Sku price */
      price: PropTypes.number.isRequired,
      /* Sku variant */
      variant: PropTypes.string,
      /* Sku brand */
      brand: PropTypes.string.isRequired,
      /* Sku options. In delivery, for examples, are the pizza options */
      options: PropTypes.arrayOf(
        PropTypes.shape({
          /* Option id */
          id: PropTypes.string.isRequired,
          /* Option quantity */
          quantity: PropTypes.number.isRequired,
          /* Option assembly id */
          assemblyId: PropTypes.string.isRequired,
          /* Option seller */
          seller: PropTypes.string,
        })
      ),
    })
  ),
  /** Component children that will be displayed inside of the button **/
  children: PropTypes.node.isRequired,
  /** Should redirect to checkout after adding to cart */
  isOneClickBuy: PropTypes.bool,
  /** Should open the Minicart after click */
  shouldOpenMinicart: PropTypes.bool,
  /** If it should add to cart when clicked */
  shouldAddToCart: PropTypes.bool,
  /** Set style to large */
  large: PropTypes.bool,
  /** Internationalization */
  intl: intlShape.isRequired,
  /** If the product is available or not*/
  available: PropTypes.bool,
  /** If it should a tooltip when you click the button but there's no SKU selected */
  showTooltipOnSkuNotSelected: PropTypes.bool,
  /** Function used to show toasts (messages) to user */
  showToast: PropTypes.func,
  /** Function to be called on the start of add to cart click event */
  onAddStart: PropTypes.func,
  /** Function to be called on the end of add to cart event */
  onAddFinish: PropTypes.func,
  /** Add to cart mutation */
  addToCart: PropTypes.func.isRequired,
  /** Open Minicart mutation */
  setMinicartOpen: PropTypes.func.isRequired,
  /** The orderFormContext object */
  orderFormContext: PropTypes.object,
  /** If the button is disabled or not */
  disabled: PropTypes.bool,
  /** A custom URL for the `VIEW CART` button inside the toast */
  customToastURL: PropTypes.string,
  /** The URL to the cart **/
  checkoutUrl: PropTypes.string,
}

export default BuyButton

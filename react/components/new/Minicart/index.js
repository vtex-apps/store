import classNames from 'classnames'
import { compose, map, partition, path, pathOr, pick, isNil, prop } from 'ramda'
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  useMemo,
} from 'react'
import { graphql, withApollo } from 'react-apollo'
import { injectIntl } from 'react-intl'
import ButtonWithIcon from '../Styleguide/ButtonWithIcon'
import ToastContext from '../Styleguide/ToastContext'
import { useRuntime } from 'vtex.render-runtime'
import IconCart from '../StoreIcons/IconCart'
import {orderForm as orderFormQuery} from '../StoreResources/Queries'
import { addToCart, updateItems } from '../StoreResources/Mutations'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import ProductPrice from '../StoreComponents/ProductPrice'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'

import MiniCartContent from './legacy/components/MiniCartContent'
import Sidebar from './legacy/components/Sidebar'
import Popup from './legacy/components/Popup'
import { shouldShowItem } from './legacy/utils/itemsHelper'
import {
  mapBuyButtonItemToPixel,
  mapCartItemToPixel,
} from './modules/pixelHelper'

import fullMinicartQuery from './legacy/localState/graphql/fullMinicartQuery.gql'
import updateItemsMutation from './legacy/localState/graphql/updateItemsMutation.gql'
import updateOrderFormMutation from './legacy/localState/graphql/updateOrderFormMutation.gql'
import updateLocalItemStatusMutation from './legacy/localState/graphql/updateLocalItemStatusMutation.gql'
import setMinicartOpenMutation from './legacy/localState/graphql/setMinicartOpenMutation.gql'

import createLocalState, { ITEMS_STATUS } from './legacy/localState'

import styles from './legacy/minicart.css'
import useMarketingSessionParams from './legacy/hooks/useMarketingSessionParams'
import useCardIdPixel from './modules/useCartIdPixel'

const DEFAULT_LABEL_CLASSES = ''
const DEFAULT_ICON_CLASSES = 'gray'

const useOffline = () => {
  const [isOffline, setOffline] = useState(() =>
    typeof navigator !== 'undefined'
      ? !pathOr(true, ['onLine'], navigator)
      : false
  )

  useEffect(() => {
    const updateStatus = () => {
      if (navigator) {
        const offline = !pathOr(true, ['onLine'], navigator)
        setOffline(offline)
      }
    }

    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)

    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  return isOffline
}

const useLinkState = client => {
  useEffect(() => {
    const { resolvers, initialState } = createLocalState(client)
    client.addResolvers(resolvers)
    // Add the initial state to if there is not there
    try {
      client.readQuery({ query: fullMinicartQuery })
    } catch (err) {
      client.writeData({ data: initialState })
    }

    const minicartData = JSON.parse(localStorage.getItem('minicart'))

    if (minicartData) {
      client.writeData({
        data: {
          minicart: {
            __typename: 'Minicart',
            items: JSON.stringify(minicartData),
          },
        },
      })
    }
  }, [client])
}

const useUpdateOrderFormOnState = (data, minicartState, updateOrderForm) => {
  // This ref guarantees that the first remote order form after mount will be saved on state, regardless of minicart state
  const hasSavedRemoteOrderFormRef = useRef(false)
  useEffect(
    () => {
      const updateLocalOrderForm = async () => {
        const orderFormData = JSON.parse(localStorage.getItem('orderForm'))

        const remoteOrderForm = data.orderForm

        if (remoteOrderForm || !orderFormData) {
          const forceRemoteOrderform =
            !hasSavedRemoteOrderFormRef.current && remoteOrderForm
          if (
            forceRemoteOrderform ||
            (!path(['orderForm'], minicartState) && remoteOrderForm)
          ) {
            hasSavedRemoteOrderFormRef.current = true
            await updateOrderForm(remoteOrderForm)
          }
        } else if (!path(['orderForm'], minicartState)) {
          await updateOrderForm(orderFormData)
        }
      }

      updateLocalOrderForm()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, minicartState]
  )
}

const partitionItemsAddUpdate = clientItems => {
  return partition(compose(isNil, prop('cartIndex')), clientItems)
}

/**
 * Minicart component
 */
const MiniCart = ({
  labelClasses = DEFAULT_LABEL_CLASSES,
  iconClasses = DEFAULT_ICON_CLASSES,
  openOnHover = false,
  client,
  setMinicartOpen,
  labelMiniCartEmpty,
  linkButtonFinishShopping,
  labelButtonFinishShopping,
  iconSize,
  iconLabel,
  showTotalItemsQty,
  showPrice,
  showDiscount,
  data,
  linkState,
  type,
  hideContent,
  showShippingCost,
  updateOrderForm,
  intl,
  updateItemsMutation,
  addToCartMutation,
  updateLocalItemStatus,
  iconsProps,
  productSummaryProps,
}) => {
  useLinkState(client)

  const [isUpdatingOrderForm, setUpdatingOrderForm] = useState(false)
  const isOffline = useOffline()

  const {
    hints: { mobile },
    navigate,
  } = useRuntime()
  const { showToast } = useContext(ToastContext)

  const minicartState = linkState.minicart || {}

  const localOrderForm = useMemo(() => {
    try {
      return JSON.parse(minicartState.orderForm)
    } catch (e) {
      return undefined
    }
  }, [minicartState.orderForm])

  const orderForm = pathOr(localOrderForm, ['orderForm'], data)
  const orderFormId =
    orderForm && orderForm.orderFormId ? orderForm.orderFormId : undefined

  useCardIdPixel(orderFormId)

  const minicartItems = useMemo(() => {
    try {
      return JSON.parse(minicartState.items)
    } catch (e) {
      return []
    }
  }, [minicartState.items])

  const modifiedItems = useMemo(
    () =>
      minicartItems.filter(
        ({ localStatus }) => localStatus === ITEMS_STATUS.MODIFIED
      ),
    [minicartItems]
  )

  useUpdateOrderFormOnState(data, minicartState, updateOrderForm)

  // synchronize values with local storage
  useEffect(() => {
    if (orderForm) {
      localStorage.setItem('minicart', JSON.stringify(minicartItems))
      localStorage.setItem('orderForm', JSON.stringify(orderForm))
    }
  }, [minicartItems, orderForm])

  const { utmParams, utmiParams } = useMarketingSessionParams()

  const addItems = useCallback(
    items => {
      if (!items.length || !orderFormId) {
        return null
      }

      return addToCartMutation({
        variables: {
          orderFormId,
          items,
          ...(utmParams ? {utmParams} : {}),
          ...(utmiParams ? {utmiParams} : {}),
        },
      })
    },
    [orderFormId, addToCartMutation, utmParams, utmiParams]
  )

  const mutateUpdateItems = useCallback(
    items => {
      if (!items.length || !orderFormId) {
        return null
      }

      return updateItemsMutation({
        variables: { orderFormId, items },
      })
    },
    [orderFormId, updateItemsMutation]
  )

  const { push } = usePixel()

  const orderFormRef = useRef(orderForm)

  const { url: checkoutUrl } = useCheckoutURL()

  useEffect(() => {
    orderFormRef.current = orderForm
  }, [orderForm])

  useEffect(
    () => {
      if (!isOffline) {
        updateLocalItemStatus()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOffline]
  )

  useEffect(
    () => {
      let isCurrent = true

      const syncItemsWithServer = async () => {
        if (!modifiedItems.length) {
          return
        }

        const prevOrderForm = orderFormRef.current

        try {
          setUpdatingOrderForm(true)

          const [itemsToAdd, itemsToUpdate] = partitionItemsAddUpdate(
            modifiedItems
          )
          const pickProps = map(
            pick(['id', 'index', 'quantity', 'seller', 'options'])
          )

          // server mutation
          const updateItemsResponse = await mutateUpdateItems(
            pickProps(itemsToUpdate)
          )

          // server mutation
          const addItemsResponse = await addItems(pickProps(itemsToAdd))

          if (itemsToAdd.length > 0) {
            push({
              event: 'addToCart',
              items: itemsToAdd.map(mapBuyButtonItemToPixel),
            })
          }

          if (!isCurrent) {
            return
          }

          const newOrderForm = pathOr(
            path(['data', 'updateItems'], updateItemsResponse),
            ['data', 'addItem'],
            addItemsResponse
          )

          push({
            event: 'cartChanged',
            items: newOrderForm && newOrderForm.items
              ? newOrderForm.items.map(mapCartItemToPixel)
              : []
          })

          setUpdatingOrderForm(false)
          await updateOrderForm(newOrderForm, true)
        } catch (err) {
          // TODO: Toast error message into Alert
          console.error(err)

          if (!isCurrent) {
            return
          }

          // Rollback items and orderForm
          setUpdatingOrderForm(false)
          await updateOrderForm(prevOrderForm, true)

          showToast({
            message: intl.formatMessage({
              id: 'store/minicart.checkout-failure',
            }),
          })
        }
      }

      if (isOffline) {
        setUpdatingOrderForm(updating => (updating ? false : updating))
        return
      }

      syncItemsWithServer()

      return () => {
        isCurrent = false
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      intl,
      isOffline,
      showToast,
      addItems,
      mutateUpdateItems,
      modifiedItems,
      push,
    ]
  )

  const handleClickButton = event => {
    if (!hideContent) {
      setMinicartOpen(!minicartState.isOpen)
    }
    event.persist()
  }

  const handleUpdateContentVisibility = () => {
    setMinicartOpen(false)
  }

  const handleClickProduct = detailUrl => {
    setMinicartOpen(false)
    navigate({
      to: detailUrl,
    })
  }

  const getFilteredItems = () => {
    return minicartItems.filter(shouldShowItem)
  }

  const itemsToShow = getFilteredItems()
  const totalItemsSum = arr =>
    arr.reduce((sum, product) => sum + product.quantity, 0)
  const quantity = showTotalItemsQty
    ? totalItemsSum(itemsToShow)
    : itemsToShow.length

  const isSizeLarge =
    (type && type === 'sidebar') ||
    mobile ||
    (window && window.innerWidth <= 480)

  const isOpen = pathOr(false, ['isOpen'], minicartState)

  const miniCartContent = (
    <MiniCartContent
      isSizeLarge={isSizeLarge}
      itemsToShow={itemsToShow}
      orderForm={{
        ...orderForm,
        items: minicartItems,
      }}
      loading={data.loading}
      showDiscount={showDiscount}
      labelMiniCartEmpty={labelMiniCartEmpty}
      linkButton={linkButtonFinishShopping || checkoutUrl}
      labelButton={labelButtonFinishShopping}
      onClickProduct={handleClickProduct}
      onClickAction={handleUpdateContentVisibility}
      showShippingCost={showShippingCost}
      updatingOrderForm={isUpdatingOrderForm}
      iconsProps={iconsProps}
      productSummaryProps={productSummaryProps}
    />
  )

  const priceClasses = classNames(
    `${styles.label} dn-m db-l t-action--small ${labelClasses}`,
    {
      pl6: quantity > 0,
      pl4: quantity <= 0,
    }
  )

  const isPriceVisible = showPrice && orderForm && orderForm.value > 0
  const iconLabelClasses = classNames(
    `${styles.label} dn-m db-l ${
      isPriceVisible ? 't-mini' : 't-action--small'
    } ${labelClasses}`,
    {
      pl6: quantity > 0,
      pl4: quantity <= 0,
    }
  )

  // This feature should only work for the popup minicart
  const shouldOpenOnHover = openOnHover && !isSizeLarge

  return (
    <aside className={`${styles.container} relative fr flex items-center`}>
      <div
        onMouseEnter={
          shouldOpenOnHover ? () => setMinicartOpen(true) : undefined
        }
        className="flex flex-column"
      >
        <ButtonWithIcon
          icon={
            <span className={`relative ${iconClasses}`}>
              <IconCart size={iconSize} {...iconsProps} />
              {quantity > 0 && (
                <span
                  data-testid="item-qty"
                  className={`${styles.badge} c-on-emphasis absolute t-mini bg-emphasis br4 w1 h1 pa1 flex justify-center items-center lh-solid`}
                >
                  {quantity}
                </span>
              )}
            </span>
          }
          variation="tertiary"
          onClick={handleClickButton}
        >
          {(iconLabel || isPriceVisible) && (
            <span className="flex items-center">
              <span className="flex flex-column items-start">
                {iconLabel && (
                  <span className={iconLabelClasses}>{iconLabel}</span>
                )}
                {isPriceVisible && (
                  <span data-testid="total-price" className={priceClasses}>
                    <div>
                      <ProductPrice
                        showLabels={false}
                        showListPrice={false}
                        sellingPrice={orderForm.value}
                      />
                    </div>
                  </span>
                )}
              </span>
            </span>
          )}
        </ButtonWithIcon>
        {!hideContent &&
          (isSizeLarge ? (
            <Sidebar
              quantity={quantity}
              iconSize={iconSize}
              onOutsideClick={handleUpdateContentVisibility}
              isOpen={isOpen}
              iconsProps={iconsProps}
            >
              {miniCartContent}
            </Sidebar>
          ) : (
            isOpen && (
              <Popup onOutsideClick={handleUpdateContentVisibility}>
                {miniCartContent}
              </Popup>
            )
          ))}
      </div>
    </aside>
  )
}

const withLinkStateUpdateItemsMutation = graphql(updateItemsMutation, {
  name: 'updateLinkStateItems',
  props: ({ updateLinkStateItems }) => ({
    updateLinkStateItems: items =>
      updateLinkStateItems({ variables: { items } }),
  }),
})

const withLinkStateUpdateOrderFormMutation = graphql(updateOrderFormMutation, {
  name: 'updateOrderForm',
  props: ({ updateOrderForm }) => ({
    updateOrderForm: (orderForm, forceUpdateItems = false) =>
      updateOrderForm({ variables: { orderForm, forceUpdateItems } }),
  }),
})

const withLinkStateUpdateLocalItemStatusMutation = graphql(
  updateLocalItemStatusMutation,
  {
    name: 'updateLocalItemStatus',
  }
)

const withLinkStateSetIsOpenMutation = graphql(setMinicartOpenMutation, {
  name: 'setMinicartOpen',
  props: ({ setMinicartOpen }) => ({
    setMinicartOpen: isOpen => setMinicartOpen({ variables: { isOpen } }),
  }),
})

const EnhancedMinicart = compose(
  graphql(orderFormQuery, { options: { ssr: false } }),
  graphql(fullMinicartQuery, { name: 'linkState', ssr: false }),
  graphql(addToCart, { name: 'addToCartMutation' }),
  graphql(updateItems, { name: 'updateItemsMutation' }),
  withApollo,
  withLinkStateUpdateItemsMutation,
  withLinkStateUpdateOrderFormMutation,
  withLinkStateUpdateLocalItemStatusMutation,
  withLinkStateSetIsOpenMutation,
  injectIntl
)(MiniCart)

EnhancedMinicart.schema = {
  title: 'admin/editor.minicart.title',
  description: 'admin/editor.minicart.description',
  type: 'object',
  properties: {
    type: {
      title: 'admin/editor.minicart.type.title',
      type: 'string',
      default: 'popup',
      enum: ['popup', 'sidebar'],
      enumNames: [
        'admin/editor.minicart.type.popup',
        'admin/editor.minicart.type.sidebar',
      ],
      widget: {
        'ui:widget': 'radio',
        'ui:options': {
          inline: true,
        },
      },
      isLayout: true,
    },
    iconLabel: {
      title: 'admin/editor.minicart.iconLabel.title',
      type: 'string',
      isLayout: false,
    },
    showDiscount: {
      title: 'admin/editor.minicart.showDiscount.title',
      type: 'boolean',
      isLayout: true,
    },
    labelMiniCartEmpty: {
      title: 'admin/editor.minicart.labelMiniCartEmpty.title',
      type: 'string',
      isLayout: false,
    },
    linkButtonFinishShopping: {
      title: 'admin/editor.minicart.linkButtonFinishShopping.title',
      type: 'string',
      isLayout: false,
    },
    labelButtonFinishShopping: {
      title: 'admin/editor.minicart.labelButtonFinishShopping.title',
      type: 'string',
      isLayout: false,
    },
  },
}

export default EnhancedMinicart

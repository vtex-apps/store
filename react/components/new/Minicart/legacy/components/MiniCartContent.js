import PropTypes from 'prop-types'
import { reduceBy, values, clone, find, propEq, compose } from 'ramda'
import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'
import classNames from 'classnames'

import { withPixel } from '../../../PixelContext/PixelContext'
// import { ExtensionPoint } from 'vtex.render-runtime'
import ButtonWithIcon from '../../../Styleguide/ButtonWithIcon'
import Spinner from '../../../Styleguide/Spinner'
import IconDelete from '../../../StoreIcons/IconDelete'

import { MiniCartPropTypes } from '../utils/propTypes'
import { toHttps, changeImageUrlSize } from '../utils/urlHelpers'
import { mapCartItemToPixel } from '../../modules/pixelHelper'

import { ITEMS_STATUS } from '../localState/index'
import updateItemsMutation from '../localState/graphql/updateItemsMutation.gql'
import updateLocalItemsMutation from '../localState/graphql/updateLocalItemsMutation.gql'
import styles from '../minicart.css'
import MiniCartFooter from './MiniCartFooter'

import ProductSummary from '../../../ProductSummary/ProductSummaryLegacy'

/**
 * Minicart content component
 */

class MiniCartContent extends Component {
  static propTypes = {
    /* Set the mini cart content size */
    isSizeLarge: PropTypes.bool,
    /** Define a function that is executed when the item is clicked */
    onClickAction: PropTypes.func,
    /* Update Items mutation */
    updateItems: PropTypes.func.isRequired,
    updateLocalItems: PropTypes.func.isRequired,
    /* Determines if the orderform is updating */
    updatingOrderForm: PropTypes.bool,
    /* Reused props */
    orderForm: PropTypes.object,
    loading: PropTypes.bool,
    labelMiniCartEmpty: MiniCartPropTypes.labelMiniCartEmpty,
    linkButton: MiniCartPropTypes.linkButtonFinishShopping,
    labelButton: MiniCartPropTypes.labelButtonFinishShopping,
    showDiscount: MiniCartPropTypes.showDiscount,
    showShippingCost: MiniCartPropTypes.showShippingCost,
    itemsToShow: PropTypes.arrayOf(PropTypes.object),
    /* Pixel push */
    push: PropTypes.func.isRequired,
    /** Props to passed to icons from store-icons */
    iconsProps: PropTypes.shape({
      viewBox: PropTypes.string,
      size: PropTypes.number,
    }),
  }

  state = { isUpdating: [] }

  sumItemsPrice = items =>
    items.reduce(
      (sum, { sellingPrice, quantity }) => sum + sellingPrice * quantity,
      0
    )

  getGroupedItems = () =>
    values(
      reduceBy(
        (acc, item) =>
          acc ? { ...acc, quantity: acc.quantity + item.quantity } : item,
        undefined,
        item => item.id,
        this.props.orderForm.items
      )
    )

  getShippingCost = orderForm => {
    const totalizer = find(propEq('id', 'Shipping'))(orderForm.totalizers || [])
    return (totalizer && totalizer.value / 100) || 0
  }

  calculateDiscount = items =>
    items.reduce(
      (sum, { listPrice, sellingPrice, quantity }) =>
        sum + (listPrice - sellingPrice) * quantity,
      0
    )

  handleItemRemoval = async (item, index) => {
    const { updateItems, updateLocalItems } = this.props
    const updatedItems = [
      {
        id: item.id,
        index: item.cartIndex != null ? item.cartIndex : index,
        quantity: 0,
      },
    ]

    try {
      if (item.cartIndex != null) {
        await updateItems(updatedItems)
      } else {
        await updateLocalItems(updatedItems)
      }

      this.props.push({
        event: 'removeFromCart',
        items: [mapCartItemToPixel(item)],
      })
    } catch (error) {
      // TODO: Toast error message
      console.error(error)
    }
  }

  updateItemLoad = (itemId, newStatus) => {
    const isUpdating = clone(this.state.isUpdating)
    isUpdating[itemId] = newStatus
    this.setState({ isUpdating })
  }

  calculateTotalValue = orderForm =>
    this.getShippingCost(orderForm)
      ? orderForm.value
      : this.sumItemsPrice(orderForm.items)

  getItemCategory = item => {
    if (!item.productCategoryIds || !item.productCategories) {
      return ''
    }

    return item.productCategoryIds
      .split('/')
      .reduce((acc, id) => acc.concat(item.productCategories[id]), [])
      .join('/')
      .slice(1, -1)
  }

  createProductShapeFromItem = item => {
    return {
      productName: item.name,
      brand: item.additionalInfo ? item.additionalInfo.brandName : undefined,
      category: this.getItemCategory(item),
      productRefId: item.productRefId,
      linkText: item.detailUrl.replace(/^\//, '').replace(/\/p$/, ''),
      sku: {
        seller: {
          commertialOffer: {
            Price: item.sellingPriceWithAssemblies * item.quantity,
            ListPrice: item.listPrice,
          },
          sellerId: item.seller,
        },
        name: item.skuName,
        itemId: item.id,
        image: {
          imageUrl: changeImageUrlSize(toHttps(item ? item.imageUrl : ''), 240),
        },
      },
      assemblyOptions: item.assemblyOptions,
      quantity: item.quantity,
      cartIndex: item.cartIndex,
    }
  }

  get isUpdating() {
    const { isUpdating } = this.state
    const {
      orderForm: { items },
      updatingOrderForm,
    } = this.props
    return (
      updatingOrderForm ||
      items.some(item => item.quantity === 0) ||
      isUpdating.some(status => status)
    )
  }

  renderWithoutItems = label => (
    <div
      className={`${styles.item} pa9 flex items-center justify-center relative bg-base`}
    >
      <span className="t-body">{label}</span>
    </div>
  )

  renderMiniCartWithItems = (
    orderForm,
    itemsToShow,
    label,
    labelDiscount,
    showDiscount,
    onClickAction,
    isUpdating,
    isSizeLarge,
    showShippingCost,
    iconsProps,
    productSummaryProps
  ) => {
    const MIN_ITEMS_TO_SCROLL = 2

    const classes = classNames(`${styles.content} overflow-x-hidden pa1`, {
      [`${styles.contentSmall} bg-base`]: !isSizeLarge,
      [`${styles.contentLarge}`]: isSizeLarge,
      'overflow-y-scroll':
        itemsToShow.length > MIN_ITEMS_TO_SCROLL && !isSizeLarge,
    })

    return (
      <Fragment>
        <div className={classes}>
          {itemsToShow.map((item, index) => (
            <Fragment key={item.id}>
              <section className={`${styles.itemContainer} relative flex`}>
                <div
                  className={`${styles.itemDeleteIcon} fr absolute top-0 right-0`}
                >
                  {isUpdating[item.id] ? (
                    <div className={`${styles.itemDeleteIconLoader} ma4`}>
                      <Spinner size={18} />
                    </div>
                  ) : (
                    <ButtonWithIcon
                      icon={
                        <IconDelete
                          size={15}
                          activeClassName="c-muted-2"
                          {...iconsProps}
                        />
                      }
                      variation="tertiary"
                      onClick={() => this.handleItemRemoval(item, index)}
                    />
                  )}
                </div>
                <ProductSummary 
                  showBorders
                  product={this.createProductShapeFromItem(item)}
                  name={item.name}
                  displayMode="inlinePrice"
                  showListPrice={false}
                  showBadge={false}
                  showInstallments={false}
                  showLabels={false}
                  actionOnClick={onClickAction}
                  muted={item.localStatus !== ITEMS_STATUS.NONE}
                  index={index}
                  {...(productSummaryProps? productSummaryProps : {})}
                />
                {/* <ExtensionPoint
                  id="product-summary"
                  showBorders
                  product={this.createProductShapeFromItem(item)}
                  name={item.name}
                  displayMode="inlinePrice"
                  showListPrice={false}
                  showBadge={false}
                  showInstallments={false}
                  showLabels={false}
                  actionOnClick={onClickAction}
                  muted={item.localStatus !== ITEMS_STATUS.NONE}
                  index={index}
                /> */}
              </section>
            </Fragment>
          ))}
        </div>
        <MiniCartFooter
          shippingCost={this.getShippingCost(orderForm)}
          isUpdating={this.isUpdating}
          totalValue={this.calculateTotalValue(orderForm)}
          discount={this.calculateDiscount(orderForm.items)}
          buttonLink={this.props.linkButton}
          buttonLabel={label}
          isSizeLarge={isSizeLarge}
          labelDiscount={labelDiscount}
          showDiscount={showDiscount}
          showShippingCost={showShippingCost}
        />
      </Fragment>
    )
  }

  renderLoading = () => (
    <div
      className={`${styles.item} pa4 flex items-center justify-center relative bg-base`}
    >
      <Spinner />
    </div>
  )

  render() {
    const {
      itemsToShow,
      labelMiniCartEmpty,
      labelButton,
      intl,
      showDiscount,
      onClickAction,
      isSizeLarge,
      showShippingCost,
      orderForm,
      loading,
      iconsProps,
      productSummaryProps,
    } = this.props
    const { isUpdating } = this.state

    if (loading) {
      return this.renderLoading()
    }

    if (!orderForm || !itemsToShow.length) {
      const label =
        labelMiniCartEmpty || intl.formatMessage({ id: 'store/minicart-empty' })
      return this.renderWithoutItems(label)
    }

    const label =
      labelButton ||
      intl.formatMessage({ id: 'store/finish-shopping-button-label' })
    const labelDiscount = intl.formatMessage({
      id: 'store/minicart-content-footer-discount',
    })

    return this.renderMiniCartWithItems(
      orderForm,
      itemsToShow,
      label,
      labelDiscount,
      showDiscount,
      onClickAction,
      isUpdating,
      isSizeLarge,
      showShippingCost,
      iconsProps,
      productSummaryProps
    )
  }
}

const withUpdateItemsMutation = graphql(updateItemsMutation, {
  name: 'updateItems',
  props: ({ updateItems }) => ({
    updateItems: items => updateItems({ variables: { items } }),
  }),
})

const withUpdateLocalItemsMutation = graphql(updateLocalItemsMutation, {
  name: 'updateLocalItems',
  props: ({ updateLocalItems }) => ({
    updateLocalItems: items => updateLocalItems({ variables: { items } }),
  }),
})

export default compose(
  injectIntl,
  withUpdateItemsMutation,
  withUpdateLocalItemsMutation,
  withPixel
)(MiniCartContent)

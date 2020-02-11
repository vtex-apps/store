import React, { Component } from 'react'
import { path } from 'ramda'
import PropTypes from 'prop-types'
import NumericStepper from '../../../Styleguide/NumericStepper'
import withToast from '../../../Styleguide/withToast'
import PixelContext from '../../../PixelContext/PixelContext'
const { Pixel } = PixelContext
import { debounce } from 'debounce'
import { injectIntl, intlShape } from 'react-intl'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { productShape } from '../../utils/propTypes'

const UPDATE_ITEMS_MUTATION = gql`
  mutation updateItemsStepper($items: [MinicartItem]) {
    updateItems(items: $items) @client
  }
`

const UPDATE_LOCAL_ITEMS_MUTATION = gql`
  mutation updateLocalItems($items: [MinicartItem]) {
    updateLocalItems(items: $items) @client
  }
`

class ProductQuantityStepper extends Component {
  static propTypes = {
    product: productShape.isRequired,
    onUpdateItemsState: PropTypes.func.isRequired,
    showToast: PropTypes.func,
    intl: intlShape,
    minicartItems: PropTypes.array,
    updateItems: PropTypes.func.isRequired,
    updateLocalItems: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    index: PropTypes.number,
  }

  state = {
    quantity: this.props.product.quantity,
    canIncrease: true,
  }

  pushPixelCartEvents = ({ isAdditionOfProd, product }) => {
    const updatedProduct = {
      skuId: path(['sku', 'itemId'], product),
      variant: path(['sku', 'name'], product),
      price: path(['assemblyOptions', 'parentPrice'], product),
      name: path(['productName'], product),
      quantity: path(['quantity'], product),
      productRefId: product.productRefId,
      brand: product.brand,
      category: product.category,
    }
    if (isAdditionOfProd) {
      this.props.push({
        event: 'addToCart',
        items: [updatedProduct],
      })
    } else {
      // removal of product
      this.props.push({
        event: 'removeFromCart',
        items: [updatedProduct],
      })
    }
  }

  componentDidUpdate = prevProps => {
    const {
      product: { quantity: prevQuantity },
    } = prevProps
    const {
      product: { quantity },
      showToast,
      intl,
    } = this.props
    if (prevQuantity !== quantity) {
      this.pushPixelCartEvents({
        isAdditionOfProd: prevQuantity < quantity,
        product: this.props.product,
      })
      const canIncrease = quantity === this.state.quantity
      this.setState({ quantity, canIncrease })
      if (!canIncrease) {
        showToast({
          message: intl.formatMessage({
            id: 'store/productSummary.quantity-error',
          }),
        })
      }
    }
  }

  handleOnChange = e => {
    e.stopPropagation()
    e.preventDefault()
    this.props.onUpdateItemsState(true)
    this.setState({ quantity: e.value }, () =>
      this.debouncedUpdate(this.state.quantity)
    )
  }

  updateItemQuantity = async quantity => {
    const { product, updateItems, updateLocalItems, index } = this.props
    this.setState({ canIncrease: true })
    const {
      sku: { itemId: id, seller = {} },
      cartIndex,
    } = product
    try {
      if (cartIndex != null) {
        await updateItems([
          {
            id,
            quantity,
            seller: seller.sellerId,
            index: cartIndex,
          },
        ])
      } else {
        await updateLocalItems([
          {
            id,
            quantity,
            seller: seller.sellerId,
            index,
          },
        ])
      }
    } catch (err) {
      // gone wrong, rollback to old quantity value
      console.error(err)
    }
    this.props.onUpdateItemsState(false)
  }

  debouncedUpdate = debounce(this.updateItemQuantity, 1000)

  render() {
    return (
      <NumericStepper
        lean
        size="small"
        value={this.state.quantity}
        minValue={1}
        maxValue={this.state.canIncrease ? undefined : this.state.quantity}
        onChange={this.handleOnChange}
      />
    )
  }
}

const withUpdateItemsMutation = graphql(UPDATE_ITEMS_MUTATION, {
  props: ({ mutate }) => ({
    updateItems: items => mutate({ variables: { items } }),
  }),
})

const withUpdateLocalItemsMutation = graphql(UPDATE_LOCAL_ITEMS_MUTATION, {
  props: ({ mutate }) => ({
    updateLocalItems: items => mutate({ variables: { items } }),
  }),
})

export default compose(
  Pixel,
  injectIntl,
  withToast,
  withUpdateItemsMutation,
  withUpdateLocalItemsMutation
)(ProductQuantityStepper)

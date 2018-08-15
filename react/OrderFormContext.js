import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'

import orderFormQuery from './queries/orderFormQuery.gql'
import addToCartMutation from './mutations/addToCartMutation.gql'
import updateItemsMutation from './mutations/updateItemsMutation.gql'
import updateOrderFormProfile from './mutations/updateOrderFormProfile.gql'

const defaultState = {
  orderFormContext: {
    message: { isSuccess: null, text: null },
    loading: true,
    orderForm: {},
    refetch: () => {},
    addItem: () => {},
    updateToastMessage: () => {},
    updateOrderForm: () => {},
    updateAndRefetchOrderForm: () => {},
    updateOrderFormProfile: () => {},
  },
}

const { Consumer, Provider } = React.createContext(defaultState)

function orderFormConsumer(WrappedComponent) {
  return class OrderFormContext extends Component {
    static displayName = `OrderFormContext(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    render() {
      return (
        <Consumer>
          {context => <WrappedComponent {...this.props} {...context} />}
        </Consumer>
      )
    }
  }
}

class ContextProvider extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  state = defaultState

  static getDerivedStateFromProps(props, state) {
    if (!props.data.loading && !props.data.error) {
      const orderFormContext = props.data

      orderFormContext.message = state.orderFormContext.message

      return {
        orderFormContext,
      }
    }

    return defaultState
  }

  handleUpdateAndRefetchOrderForm = vars => {
    return this.props.updateOrderForm(vars).then(() => {
      return this.props.data.refetch()
    })
  }

  handleMessageUpdate = message => {
    const context = this.state.orderFormContext
    context.message = message

    this.setState({ orderFormContext: context })
  }

  render() {
    const state = this.state

    state.orderFormContext.updateToastMessage = this.handleMessageUpdate
    state.orderFormContext.updateAndRefetchOrderForm = this.handleUpdateAndRefetchOrderForm
    state.orderFormContext.updateOrderFormProfile = this.props.updateOrderFormProfile
    state.orderFormContext.updateOrderForm = this.props.updateOrderForm
    state.orderFormContext.addItem = this.props.addItem

    return <Provider value={this.state}>{this.props.children}</Provider>
  }
}

const options = {
  options: () => ({
    ssr: false,
  }),
}

const contextPropTypes = PropTypes.shape({
  /* Toast message that will be displayed  */
  message: PropTypes.shape({
    isSuccess: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  /* Is information still loading*/
  loading: PropTypes.bool.isRequired,
  /* Function to refetch the orderForm query */
  refetch: PropTypes.func.isRequired,
  /* Function to add a new item into the orderForm */
  addItem: PropTypes.func.isRequired,
  /* Function to update the orderForm */
  updateOrderForm: PropTypes.func.isRequired,
  /* Function to update the orderForm profile data*/
  updateOrderFormProfile: PropTypes.func.isRequired,
  /* Function to update the orderForm and refetch the data*/
  updateAndRefetchOrderForm: PropTypes.func.isRequired,
  /* Function to update the message */
  updateToastMessage: PropTypes.func.isRequired,
  /* Order form */
  orderForm: PropTypes.shape({
    /* Order form id */
    orderFormId: PropTypes.string,
    /* Total price of the order */
    value: PropTypes.number,
    /* Items in the mini cart */
    items: PropTypes.arrayOf(PropTypes.object),
  }),
}).isRequired

export const OrderFormProvider = compose(
  graphql(orderFormQuery, options),
  graphql(addToCartMutation, { name: 'addItem' }),
  graphql(updateItemsMutation, { name: 'updateOrderForm' }),
  graphql(updateOrderFormProfile, { name: 'updateOrderFormProfile' })
)(ContextProvider)

export default { orderFormConsumer, contextPropTypes }

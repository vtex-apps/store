import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'

import orderFormQuery from './queries/orderFormQuery.gql'
import addToCartMutation from './mutations/addToCartMutation.gql'

const defaultState = {
  loading: true,
  orderForm: {},
  refetch: () => {},
  updateOrderForm: () => {},
  updateAndRefetchOrderForm: () => {},
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

  state = {}

  static getDerivedStateFromProps(props) {
    if (!props.data.loading && !props.data.error) {
      let orderFormContext = props.data
      orderFormContext.updateOrderForm = props.updateOrderForm
      orderFormContext.updateAndRefetchOrderForm = vars => {
        props.updateOrderForm(vars).then(() => {
          props.data.refetch()
        })
      }

      return {
        orderFormContext,
      }
    }

    return {
      orderFormContext: defaultState,
    }
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>
  }
}

const options = {
  options: () => ({
    ssr: false,
  }),
}

const contextPropTypes = PropTypes.shape({
  loading: PropTypes.bool.isRequired,
  /* Function to refetch the orderForm query */
  refetch: PropTypes.func.isRequired,
  /* Function to update the orderForm */
  updateOrderForm: PropTypes.func.isRequired,
  /* Function to update the orderForm and refetch the data*/
  updateAndRefetchOrderForm: PropTypes.func.isRequired,
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
  graphql(addToCartMutation, { name: 'updateOrderForm' })
)(ContextProvider)

export default { orderFormConsumer, contextPropTypes }

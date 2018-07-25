import React, { Component } from 'react'
import PropTypes from 'prop-types'

const defaultState = {
  loading: true,
  orderForm: {},
  refetch: () => {},
  updateOrderForm: () => {},
}

export function retrieveStateFromProps(props) {
  if (!props.data.loading && !props.data.error) {
    let orderFormContext = props.data
    orderFormContext.updateOrderForm = props.updateOrderForm

    return {
      orderFormContext,
    }
  }

  return {
    orderFormContext: defaultState,
  }
}

export const contextPropTypes = PropTypes.shape({
  loading: PropTypes.bool.isRequired,
  /* Function to refetch the orderForm query */
  refetch: PropTypes.func.isRequired,
  /* Function to update the orderForm */
  updateOrderForm: PropTypes.func.isRequired,
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

export { Provider as OrderFormProvider }

export const orderFormProps = {
  orderForm: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
}

export default { orderFormConsumer }

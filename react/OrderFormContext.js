import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const defaultState = {
  loading: true,
  orderForm: {},
  refetch: () => {},
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

export { Provider as OrderFormProvider }

export const orderFormProps = {
  orderForm: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
}

export default { orderFormConsumer }

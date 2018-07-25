import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import PropTypes from 'prop-types'
import { OrderFormProvider, retrieveStateFromProps } from './OrderFormContext'
import { DataLayerProvider } from './components/withDataLayer'

import orderFormQuery from './queries/orderFormQuery.gql'
import addToCartMutation from './mutations/addToCartMutation.gql'

class StoreContextProvider extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  state = {}

  pushToDataLayer = obj => {
    window.dataLayer.push(obj)
  }

  static getDerivedStateFromProps(props) {
    return retrieveStateFromProps(props)
  }

  render() {
    window.dataLayer = window.dataLayer || []

    return (
      <DataLayerProvider
        value={{
          dataLayer: window.dataLayer,
          pushToDataLayer: this.pushToDataLayer,
        }}
      >
        <OrderFormProvider value={this.state}>
          <div className="vtex-store__template">{this.props.children}</div>
        </OrderFormProvider>
      </DataLayerProvider>
    )
  }
}

const options = {
  options: () => ({
    ssr: false,
  }),
}

export default compose(
  graphql(orderFormQuery, options),
  graphql(addToCartMutation, { name: 'updateOrderForm' })
)(StoreContextProvider)

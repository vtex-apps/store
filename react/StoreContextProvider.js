import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { OrderFormProvider } from './OrderFormContext'
import { DataLayerProvider } from './components/withDataLayer'

import orderFormQuery from './queries/orderFormQuery.gql'

class StoreContextProvider extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  state = {}

  pushToDataLayer = obj => {
    window.dataLayer.push(obj)
  }

  static getDerivedStateFromProps(props) {
    if (!props.data.loading && !props.data.error) {
      return {
        orderFormData: {
          orderForm: props.data.orderForm,
          refetch: () => props.data.refetch(),
        },
      }
    }

    return {
      orderFormData: {
        orderForm: {},
        refetch: () => {},
      },
    }
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

export default graphql(orderFormQuery, options)(StoreContextProvider)

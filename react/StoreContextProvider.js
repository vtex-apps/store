import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OrderFormProvider } from './OrderFormContext'
import { DataLayerProvider } from './components/withDataLayer'

class StoreContextProvider extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  pushToDataLayer = obj => {
    window.dataLayer.push(obj)
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
        <OrderFormProvider>
          <div className="vtex-store__template">{this.props.children}</div>
        </OrderFormProvider>
      </DataLayerProvider>
    )
  }
}

export default StoreContextProvider

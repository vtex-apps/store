import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
        <div className="vtex-store__template">{this.props.children}</div>
      </DataLayerProvider>
    )
  }
}

export default StoreContextProvider

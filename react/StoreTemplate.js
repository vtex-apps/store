import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ExtensionPoint } from 'render'

import { DataLayerProvider } from './components/withDataLayer'

export default class StoreTemplate extends Component {
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
        <ExtensionPoint id="theme" />
        <ExtensionPoint id="header" />
        <div className="vtex-store__template">{this.props.children}</div>
        <ExtensionPoint id="footer" />
      </DataLayerProvider>
    )
  }
}

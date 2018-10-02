import React, { Component } from 'react'
import { Helmet } from 'render'
import PropTypes from 'prop-types'

import { OrderFormProvider } from './OrderFormContext'
import { DataLayerProvider } from './components/withDataLayer'
import { pixelGlobalContext } from './PixelContext'

const APP_LOCATOR = 'vtex.store'
const CONTENT_TYPE = 'text/html;charset=utf-8'
const META_ROBOTS = 'index, follow'

class StoreContextProvider extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  render() {
    const { country, locale, currency } = global.__RUNTIME__.culture
    const settings = this.context.getSettings(APP_LOCATOR) || {}
    const {
      titleTag,
      metaTagDescription,
      metaTagKeywords,
      metaTagRobots,
      storeName,
    } = settings

    return (
      <DataLayerProvider
      value={{
        dataLayer: window.dataLayer,
        set: this.props.push,
      }}
      >
        <Helmet>
          <title>{titleTag}</title>
          <meta name="description" content={metaTagDescription} />
          <meta name="keywords" content={metaTagKeywords} />
          <meta name="copyright" content={storeName} />
          <meta name="author" content={storeName} />
          <meta name="country" content={country} />
          <meta name="language" content={locale} />
          <meta name="currency" content={currency} />
          <meta name="robots" content={metaTagRobots || META_ROBOTS} />
          <meta httpEquiv="Content-Type" content={CONTENT_TYPE} />
        </Helmet>
        <OrderFormProvider>
          <div className="vtex-store__template">{this.props.children}</div>
        </OrderFormProvider>
      </DataLayerProvider>
    )
  }
}

StoreContextProvider.contextTypes = {
  getSettings: PropTypes.func,
}

export default pixelGlobalContext(StoreContextProvider)

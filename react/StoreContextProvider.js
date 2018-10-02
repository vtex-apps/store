import React, { Component } from 'react'
import { Helmet } from 'render'
import PropTypes from 'prop-types'

import { OrderFormProvider } from './OrderFormContext'
import { DataLayerProvider } from './components/withDataLayer'
import { gtmScript, gtmFrame } from './scripts/gtm'
import { pixelGlobalContext } from './PixelContext'

const APP_LOCATOR = 'vtex.store'
const CONTENT_TYPE = 'text/html;charset=utf-8'
const META_ROBOTS = 'index, follow'

const GTM_UNDEFINED = `No Google Tag Manager ID is defined. Take a look at:\
https://${global.__RUNTIME__.workspace}--${global.__RUNTIME__.account}.myvtex.com/admin/apps/vtex.store/setup`

class StoreContextProvider extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  pushToDataLayer = obj => {
    console.log(">>> Push to datalayer")
    this.props.push(obj)
  }

  /**
   * Ensure that the Data Layer exists and will be recreated
   * after each children change (navigation).
   */
  initDataLayer = () => {
    const { dataLayer } = window
    if (dataLayer) {
      dataLayer.splice(0, dataLayer.length)
    } else {
      console.warn(GTM_UNDEFINED)
      window.dataLayer = []
    }
  }

  render() {
    const { country, locale, currency } = global.__RUNTIME__.culture
    const settings = this.context.getSettings(APP_LOCATOR) || {}
    const {
      gtmId,
      titleTag,
      metaTagDescription,
      metaTagKeywords,
      metaTagRobots,
      storeName,
    } = settings
    const scripts = gtmId ? [{
      'type': 'application/javascript',
      'innerHTML': gtmScript(gtmId),
    }] : []
    const noscripts = gtmId ? [{ id: 'gtm_frame', innerHTML: gtmFrame(gtmId) }] : []

    this.initDataLayer()
    return (
      <DataLayerProvider
      value={{
        dataLayer: window.dataLayer,
        set: this.pushToDataLayer,
      }}
      >
        <Helmet script={scripts} noscript={noscripts} />
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

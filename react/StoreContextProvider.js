import { isEmpty } from 'ramda'
import React, { Component, Fragment } from 'react'
import { Helmet, withRuntimeContext, ExtensionPoint } from 'render'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'

import canonicalPathFromParams from './utils/canonical'
import GtmScripts from './components/GtmScripts'
import PageViewPixel from './components/PageViewPixel'
import { OrderFormProvider } from './OrderFormContext'
import { DataLayerProvider } from './components/withDataLayer'
import { PixelProvider } from './PixelContext'

import pwaManifestQuery from './queries/pwaManifestQuery.gql'

const APP_LOCATOR = 'vtex.store'
const CONTENT_TYPE = 'text/html;charset=utf-8'
const META_ROBOTS = 'index, follow'
const MOBILE_SCALING = 'width=device-width, initial-scale=1'

class StoreContextProvider extends Component {
  static propTypes = {
    runtime: PropTypes.shape({
      prefetchDefaultPages: PropTypes.func,
      culture: PropTypes.shape({
        country: PropTypes.string,
        locale: PropTypes.string,
        currency: PropTypes.string,
      }),
    }),
    children: PropTypes.element,
    push: PropTypes.func,
    data: PropTypes.shape({
      loading: PropTypes.bool,
      manifest: PropTypes.shape({
        theme_color: PropTypes.string,
      }),
    }),
  }

  componentDidMount () {
    const {
      runtime: {
        prefetchDefaultPages
      }
    } = this.props
    prefetchDefaultPages([
      'store/product',
    ])
  }

  render() {
    const {
      runtime: {
        culture: { country, locale, currency },
        pages,
        page,
        route,
      },
    } = this.props
    const settings = this.context.getSettings(APP_LOCATOR) || {}
    const {
      gtmId,
      titleTag,
      metaTagDescription,
      metaTagKeywords,
      metaTagRobots,
      storeName,
    } = settings
    const { data: { manifest, loading } = {} } = this.props

    window.dataLayer = window.dataLayer || []

    let canonicalPath = route.canonical

    const params = route.params
    const canonicalTemplate = pages[page].canonical

    if (!canonicalPath && !isEmpty(params) && canonicalTemplate) {
      canonicalPath = canonicalPathFromParams(canonicalTemplate, params)
    }

    return (
      <Fragment>
        <ExtensionPoint id="store/__icons" />
        <PixelProvider>
          <DataLayerProvider value={{ dataLayer: window.dataLayer }}>
            <GtmScripts gtmId={gtmId} />
            <ExtensionPoint id="store/pixel" />
            <ExtensionPoint id="store/rc" />
            <PageViewPixel />
            <Helmet>
              <title>{titleTag}</title>
              <meta name="viewport" content={MOBILE_SCALING} />
              <meta name="description" content={metaTagDescription} />
              <meta name="keywords" content={metaTagKeywords} />
              <meta name="copyright" content={storeName} />
              <meta name="author" content={storeName} />
              <meta name="country" content={country} />
              <meta name="language" content={locale} />
              <meta name="currency" content={currency} />
              <meta name="robots" content={metaTagRobots || META_ROBOTS} />
              <meta httpEquiv="Content-Type" content={CONTENT_TYPE} />
              {canonicalPath && (
                <link
                  rel="canonical"
                  href={`https://${window.__hostname__ || window.location && window.location.hostname}${canonicalPath}`}
                />
              )}
            </Helmet>
            <OrderFormProvider>
              <div className="vtex-store__template">{this.props.children}</div>
            </OrderFormProvider>
          </DataLayerProvider>
        </PixelProvider>
      </Fragment>
    )
  }
}

StoreContextProvider.contextTypes = {
  getSettings: PropTypes.func,
}

export default graphql(pwaManifestQuery)(
  withRuntimeContext(StoreContextProvider)
)

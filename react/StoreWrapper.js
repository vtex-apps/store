import { isEmpty, path } from 'ramda'
import React, { Component, Fragment } from 'react'
import { Helmet, withRuntimeContext, ExtensionPoint } from 'render'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { ToastProvider } from 'vtex.styleguide'

import canonicalPathFromParams from './utils/canonical'
import IconPack from './components/IconPack'
import PageViewPixel from './components/PageViewPixel'
import OrderFormProvider from './components/OrderFormProvider'
import { DataLayerProvider } from './components/withDataLayer'
import { PixelProvider } from './PixelContext'

import pwaDataQuery from './queries/pwaDataQuery.gql'

const APP_LOCATOR = 'vtex.store'
const CONTENT_TYPE = 'text/html; charset=utf-8'
const META_ROBOTS = 'index, follow'
const MOBILE_SCALING = 'width=device-width, initial-scale=1'

const iOSIconSizes = ['80x80', '152x152', '167x167', '180x180']

class StoreWrapper extends Component {
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
        icons: PropTypes.arrayOf(
          PropTypes.shape({
            src: PropTypes.string,
            type: PropTypes.string,
            sizes: PropTypes.string,
          })
        ),
      }),
    }),
  }

  componentDidMount() {
    const {
      runtime: { prefetchDefaultPages },
    } = this.props
    prefetchDefaultPages([
      'store.product',
    ])
  }

  render() {
    const {
      runtime: {
        culture: { country, locale, currency },
        history,
        pages,
        page,
        route,
      },
    } = this.props
    const settings = this.context.getSettings(APP_LOCATOR) || {}
    const {
      titleTag,
      metaTagDescription,
      metaTagKeywords,
      metaTagRobots,
      storeName,
    } = settings
    const { data: { manifest, splashes, loading, error } = {} } = this.props
    const hasManifest = !loading && manifest && !error

    window.dataLayer = window.dataLayer || []

    let canonicalPath = route.canonical

    const params = route.params
    const canonicalTemplate = pages[page].canonical

    if (!canonicalPath && !isEmpty(params) && canonicalTemplate) {
      canonicalPath = canonicalPathFromParams(canonicalTemplate, params)
      const pathname = path(['location', 'pathname'], history)
      const decodedCanonicalPath = decodeURIComponent(canonicalPath)
      if (pathname && canonicalPath && decodedCanonicalPath !== pathname) {
        history.replace(`${canonicalPath}${history.location.search}`, {
          renderRouting: true,
          route,
        })
      }
    }

    return (
      <Fragment>
        <IconPack />
        <PixelProvider>
          <DataLayerProvider value={{ dataLayer: window.dataLayer }}>
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
                  href={`https://${window.__hostname__ ||
                    (window.location &&
                      window.location.hostname)}${canonicalPath}`}
                />
              )}
            </Helmet>
            {/* PWA */}
            {hasManifest && (
              <Helmet>
                <meta name="theme-color" content={manifest.theme_color} />
                <link rel="manifest" href="/pwa/manifest.json" />
                <script
                  type="text/javascript"
                  src={`/pwa/workers/register.js${route.path.match(/\?.*/) || ''}`}
                />
                {hasManifest &&
                  manifest.icons &&
                  manifest.icons
                    .filter(({ sizes }) => iOSIconSizes.includes(sizes))
                    .map(icon => (
                      <link
                        key={icon.src}
                        rel="apple-touch-icon"
                        sizes={icon.sizes}
                        href={icon.src}
                      />
                    ))}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                {splashes &&
                  splashes.map(splash => (
                    <link
                      key={splash.src}
                      href={splash.src}
                      sizes={splash.sizes}
                      rel="apple-touch-startup-image"
                    />
                  ))}
              </Helmet>
            )}
            <ToastProvider positioning="window">
              <OrderFormProvider>
                <div className="vtex-store__template">
                  {this.props.children}
                </div>
              </OrderFormProvider>
            </ToastProvider>
          </DataLayerProvider>
        </PixelProvider>
      </Fragment>
    )
  }
}

StoreWrapper.contextTypes = {
  getSettings: PropTypes.func,
}

export default graphql(pwaDataQuery)(withRuntimeContext(StoreWrapper))

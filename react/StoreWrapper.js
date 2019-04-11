import { path } from 'ramda'
import React, { Component, Fragment } from 'react'
import {
  canUseDOM,
  ExtensionPoint,
  Helmet,
  NoSSR,
  withRuntimeContext,
} from 'vtex.render-runtime'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { PixelProvider } from 'vtex.pixel-manager/PixelContext'
import PixelManager from 'vtex.pixel-manager/PixelManager'
import { ToastProvider } from 'vtex.styleguide'

import canonicalPathFromParams from './utils/canonical'
import PageViewPixel from './components/PageViewPixel'
import OrderFormProvider from './components/OrderFormProvider'
import { DataLayerProvider } from './components/withDataLayer'
import NetworkStatusToast from './components/NetworkStatusToast'

import pwaDataQuery from './queries/pwaDataQuery.gql'

const APP_LOCATOR = 'vtex.store'
const CONTENT_TYPE = 'text/html; charset=utf-8'
const META_ROBOTS = 'index, follow'
const MOBILE_SCALING = 'width=device-width, initial-scale=1'

const systemToCanonical = ({ page, pages, route, history }) => {
  const { params } = route
  const canonicalRouteTemplate = pages[page].canonical
  const canonicalPath = canonicalPathFromParams(canonicalRouteTemplate, params)
  const canonicalHost =
    window.__hostname__ || (window.location && window.location.hostname)
  return {
    canonicalPath,
    canonicalHost,
  }
}

const replaceHistoryToCanonical = ({ route, history }, canonicalPath) => {
  const pathname = path(['location', 'pathname'], history)
  const search = path(['location', 'search'], history)
  const navigationRoute = path(
    ['location', 'state', 'navigationRoute'],
    history
  )

  if (!canonicalPath || !pathname) {
    return
  }

  const decodedCanonicalPath = decodeURIComponent(canonicalPath)

  if (decodedCanonicalPath !== pathname) {
    history.replace(`${canonicalPath}${search}`, {
      fetchPage: false,
      navigationRoute,
      renderRouting: true,
      route,
    })
  }
}

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

  isStorefrontIframe =
    canUseDOM && window.top !== window.self && window.top.__provideRuntime

  componentDidMount() {
    const {
      runtime: { prefetchDefaultPages },
    } = this.props
    prefetchDefaultPages(['store.product'])
  }

  render() {
    const {
      runtime: {
        culture: { country, locale, currency },
        history,
        pages,
        page,
        route,
        getSettings,
      },
    } = this.props
    const settings = getSettings(APP_LOCATOR) || {}
    const {
      titleTag,
      metaTagDescription,
      metaTagKeywords,
      metaTagRobots,
      storeName,
      faviconLinks,
    } = settings
    const {
      data: { manifest, iOSIcons, splashes, loading, error } = {},
    } = this.props
    const hasManifest = !loading && manifest && !error
    const { canonicalHost, canonicalPath } = systemToCanonical({
      pages,
      page,
      route,
      history,
    })
    replaceHistoryToCanonical({ route, history }, canonicalPath)

    window.dataLayer = window.dataLayer || []

    return (
      <Fragment>
        <PixelProvider>
          <DataLayerProvider value={{ dataLayer: window.dataLayer }}>
            <PixelManager />
            <PageViewPixel />
            <Helmet
              title={titleTag}
              meta={[
                { name: 'viewport', content: MOBILE_SCALING },
                { name: 'description', content: metaTagDescription },
                { name: 'keywords', content: metaTagKeywords },
                { name: 'copyright', content: storeName },
                { name: 'author', content: storeName },
                { name: 'country', content: country },
                { name: 'language', content: locale },
                { name: 'currency', content: currency },
                { name: 'robots', content: metaTagRobots || META_ROBOTS },
                { httpEquiv: 'Content-Type', content: CONTENT_TYPE },
              ]}
              link={[
                ...(faviconLinks || []),
                canonicalPath &&
                  canonicalHost && {
                    rel: 'canonical',
                    href: `https://${canonicalHost}${canonicalPath}`,
                  },
              ].filter(Boolean)}
            />
            {/* PWA */}
            {hasManifest && (
              <Helmet
                meta={[
                  { name: 'theme-color', content: manifest.theme_color },
                  { name: 'apple-mobile-web-app-capable', content: 'yes' },
                ]}
                script={[
                  {
                    type: 'text/javascript',
                    src: `/pwa/workers/register.js${route.path.match(/\?.*/) ||
                      ''}`,
                  },
                ]}
                link={[
                  { rel: 'manifest', href: '/pwa/manifest.json' },
                  ...(hasManifest
                    ? iOSIcons.map(icon => ({
                        rel: 'apple-touch-icon',
                        sizes: icon.sizes,
                        href: icon.src,
                      }))
                    : []),
                  ...splashes.map(splash => ({
                    href: splash.src,
                    sizes: splash.sizes,
                    rel: 'apple-touch-startup-image',
                  })),
                ].filter(Boolean)}
              />
            )}
            <ToastProvider positioning="window">
              <NetworkStatusToast />
              <OrderFormProvider>
                <div className="vtex-store__template bg-base">
                  {this.props.children}
                </div>
              </OrderFormProvider>
            </ToastProvider>
          </DataLayerProvider>
        </PixelProvider>
        {this.isStorefrontIframe && (
          <NoSSR>
            <ExtensionPoint id="highlight-overlay" />
          </NoSSR>
        )}
      </Fragment>
    )
  }
}

export default graphql(pwaDataQuery)(withRuntimeContext(StoreWrapper))

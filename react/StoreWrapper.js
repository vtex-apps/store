import React, { Component, Fragment } from 'react'
import {
  canUseDOM,
  ExtensionPoint,
  Helmet,
  NoSSR,
  withRuntimeContext,
} from 'vtex.render-runtime'
import PropTypes from 'prop-types'
import { parse } from 'query-string'
import { Query } from 'react-apollo'
import { PixelProvider } from 'vtex.pixel-manager/PixelContext'
import { ToastProvider } from 'vtex.styleguide'
import { PWAProvider } from 'vtex.store-resources/PWAContext'

import PageViewPixel from './components/PageViewPixel'
import OrderFormProvider from './components/OrderFormProvider'
import NetworkStatusToast from './components/NetworkStatusToast'
import WrapperContainer from './components/WrapperContainer'

import pwaDataQuery from './queries/pwaDataQuery.gql'

const APP_LOCATOR = 'vtex.store'
const CONTENT_TYPE = 'text/html; charset=utf-8'
const META_ROBOTS = 'index, follow'
const MOBILE_SCALING = 'width=device-width, initial-scale=1'

const DISABLE_SW_QUERYSTRING = 'disableSW'

const systemToCanonical = ({ canonicalPath }) => {
  const canonicalHost =
    window.__hostname__ || (window.location && window.location.hostname)
  return {
    canonicalPath,
    canonicalHost,
  }
}

const joinKeywords = keywords => {
  return keywords && keywords.length > 0 ? keywords.join(', ') : ''
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
      route: PropTypes.shape({
        metaTags: PropTypes.shape({
          description: PropTypes.string,
          keywords: PropTypes.arrayOf(PropTypes.string),
        }),
        title: PropTypes.string,
      }),
    }),
    children: PropTypes.element,
    push: PropTypes.func,
    data: PropTypes.shape({
      loading: PropTypes.bool,
      manifest: PropTypes.shape({
        // eslint-disable-next-line @typescript-eslint/camelcase
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
        route,
        route: { metaTags, title: pageTitle },
        getSettings,
        rootPath = '',
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
    const { canonicalHost, canonicalPath } = systemToCanonical(route)
    const description = (metaTags && metaTags.description) || metaTagDescription
    const keywords =
      joinKeywords(metaTags && metaTags.keywords) || metaTagKeywords
    const title = pageTitle || titleTag

    const [queryMatch] = route.path.match(/\?.*/) || '?'
    const query = parse(queryMatch)

    const enableSW = !(DISABLE_SW_QUERYSTRING in query)

    return (
      <Fragment>
        {enableSW && (
          <>
            <Query query={pwaDataQuery} ssr={false}>
              {({ data, loading, error }) => {
                const { manifest, pwaSettings, iOSIcons, splashes } = data
                const hasManifest = !loading && manifest && !error
                return (
                  <PWAProvider settings={pwaSettings}>
                    {/* PWA */}
                    {hasManifest && (
                      <Helmet
                        meta={[
                          {
                            name: 'theme-color',
                            content: manifest.theme_color,
                          },
                          {
                            name: 'apple-mobile-web-app-capable',
                            content: 'yes',
                          },
                        ]}
                        link={[
                          {
                            rel: 'manifest',
                            href: `${rootPath}/pwa/manifest.json`,
                          },
                          ...(iOSIcons
                            ? iOSIcons.map(icon => ({
                                rel: 'apple-touch-icon',
                                sizes: icon.sizes,
                                href: `${rootPath}${icon.src}`,
                              }))
                            : []),
                          ...(splashes
                            ? splashes.map(splash => ({
                                href: `${rootPath}${splash.src}`,
                                sizes: splash.sizes,
                                rel: 'apple-touch-startup-image',
                              }))
                            : []),
                        ].filter(Boolean)}
                      />
                    )}
                  </PWAProvider>
                )
              }}
            </Query>
            <Helmet
              script={[
                {
                  type: 'text/javascript',
                  src: `${rootPath}/pwa/workers/register.js${queryMatch}&scope=${encodeURIComponent(
                    rootPath
                  )}`,
                  defer: true,
                },
              ]}
            />
          </>
        )}
        <Helmet
          title={title}
          meta={[
            { name: 'viewport', content: MOBILE_SCALING },
            { name: 'description', content: description },
            { name: 'keywords', content: keywords },
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
        <PixelProvider currency={currency}>
          <PageViewPixel />
          <ToastProvider positioning="window">
            <NetworkStatusToast />
            <OrderFormProvider>
              <WrapperContainer className="vtex-store__template bg-base">
                {this.props.children}
              </WrapperContainer>
            </OrderFormProvider>
          </ToastProvider>
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

export default withRuntimeContext(StoreWrapper)

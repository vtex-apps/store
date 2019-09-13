import React, { Component, Fragment } from 'react'
import {
  canUseDOM,
  ExtensionPoint,
  Helmet,
  NoSSR,
  withRuntimeContext,
} from 'vtex.render-runtime'
import PropTypes from 'prop-types'
import { PixelProvider } from 'vtex.pixel-manager/PixelContext'
import { ToastProvider } from 'vtex.styleguide'
import { PWAProvider } from 'vtex.store-resources/PWAContext'

import PageViewPixel from './components/PageViewPixel'
import OrderFormProvider from './components/OrderFormProvider'
import NetworkStatusToast from './components/NetworkStatusToast'
import WrapperContainer from './components/WrapperContainer'

const APP_LOCATOR = 'vtex.store'
const CONTENT_TYPE = 'text/html; charset=utf-8'
const META_ROBOTS = 'index, follow'
const MOBILE_SCALING = 'width=device-width, initial-scale=1'

const systemToCanonical = ({ canonicalPath }) => {
  const canonicalHost =
    window.__hostname__ || (window.location && window.location.hostname)
  return {
    canonicalPath,
    canonicalHost,
  }
}

class StoreWrapper extends Component {
  static propTypes = {
    runtime: PropTypes.shape({
      amp: PropTypes.boolean,
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
    prefetchDefaultPages([
      'store.custom',
      'store.product',
      'store.search',
      'store.search#brand',
      'store.search#category',
      'store.search#configurable',
      'store.search#custom',
      'store.search#department',
      'store.search#subcategory',
      'store.search#subcategory-terms',
    ])
  }

  render() {
    const {
      runtime: {
        amp,
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
      metaTagRobots,
      storeName,
      faviconLinks,
    } = settings

    const { canonicalHost, canonicalPath } = systemToCanonical(route)
    const description = (metaTags && metaTags.description) || metaTagDescription
    const title = pageTitle || titleTag

    const [queryMatch] = route.path.match(/\?.*/) || ['?']

    return (
      <Fragment>
        <Helmet
          title={title}
          meta={[
            // viewport meta tag is already handled in render-server for AMP pages
            !amp && { name: 'viewport', content: MOBILE_SCALING },
            { name: 'description', content: description },
            { name: 'copyright', content: storeName },
            { name: 'author', content: storeName },
            { name: 'country', content: country },
            { name: 'language', content: locale },
            { name: 'currency', content: currency },
            { name: 'robots', content: metaTagRobots || META_ROBOTS },
            { httpEquiv: 'Content-Type', content: CONTENT_TYPE },
          ]
            .filter(Boolean)
            .filter(meta => meta.content && meta.content.length > 0)}
          script={[
            {
              type: 'text/javascript',
              src: `${rootPath}/pwa/workers/register.js${queryMatch}&scope=${encodeURIComponent(
                rootPath
              )}`,
              defer: true,
            },
          ]}
          link={[
            ...(faviconLinks || []),
            ...(!amp
              ? [
                  {
                    rel: 'amphtml',
                    href: encodeURI(
                      `https://${canonicalHost}${rootPath}${canonicalPath}?amp`
                    ),
                  },
                  canonicalPath &&
                    canonicalHost && {
                      rel: 'canonical',
                      href: encodeURI(
                        `https://${canonicalHost}${rootPath}${
                          canonicalPath ? canonicalPath.toLowerCase() : ''
                        }`
                      ),
                    },
                ]
              : []),
          ].filter(Boolean)}
        />
        <PixelProvider currency={currency}>
          <PWAProvider rootPath={rootPath}>
            <PageViewPixel title={title} />
            <ToastProvider positioning="window">
              <NetworkStatusToast />
              <OrderFormProvider>
                <WrapperContainer className="vtex-store__template bg-base">
                  {this.props.children}
                </WrapperContainer>
              </OrderFormProvider>
            </ToastProvider>
          </PWAProvider>
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

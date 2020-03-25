import React, { Fragment, useEffect } from 'react'
import {
  canUseDOM,
  ExtensionPoint,
  Helmet,
  NoSSR,
  useRuntime,
} from 'vtex.render-runtime'
import PropTypes from 'prop-types'
import { PixelProvider } from 'vtex.pixel-manager/PixelContext'
import { ToastProvider } from 'vtex.styleguide'
import { PWAProvider } from 'vtex.store-resources/PWAContext'
import { OrderQueueProvider } from 'vtex.order-manager/OrderQueue'
import { OrderItemsProvider } from 'vtex.order-items/OrderItems'
import { OrderFormProvider as OrderFormProviderCheckout } from 'vtex.order-manager/OrderForm'

import UserDataPixel from './components/UserDataPixel'
import PageViewPixel from './components/PageViewPixel'
import OrderFormProvider from './components/OrderFormProvider'
import NetworkStatusToast from './components/NetworkStatusToast'
import WrapperContainer from './components/WrapperContainer'
import { normalizeNavigation } from './utils/navigation'

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

const useFavicons = faviconLinks => {
  const { rootPath = '' } = useRuntime()
  if (!rootPath) {
    return faviconLinks
  }

  return (faviconLinks || []).map(favicon => {
    // Only fix if is relative path
    const { href } = favicon
    if (!href || href[0] !== '/') {
      return favicon
    }
    return { ...favicon, href: rootPath + href }
  })
}

/**
 * The setCheckoutCookie prop is necessary to protect stores using both
 * OrderFormProviders from inconsistencies regarding the checkout.vtex.com cookie.
 * Its goal is to prevent vtex.checkout-graphql from overwriting the value set by
 * vtex.store-graphql.
 */
const StoreContent = ({ setCheckoutCookie, children }) => (
  <OrderQueueProvider>
    <OrderFormProviderCheckout setCheckoutCookie={setCheckoutCookie}>
      <OrderItemsProvider>
        <WrapperContainer className="vtex-store__template bg-base">
          {children}
        </WrapperContainer>
      </OrderItemsProvider>
    </OrderFormProviderCheckout>
  </OrderQueueProvider>
)

const StoreWrapper = ({ children }) => {
  const {
    amp,
    culture: { country, locale, currency },
    route,
    route: { metaTags, title: pageTitle },
    getSettings,
    rootPath = '',
    prefetchDefaultPages,
    addNavigationRouteModifier,
  } = useRuntime()
  const isStorefrontIframe =
    canUseDOM && window.top !== window.self && window.top.__provideRuntime

  const supportsServiceWorker = canUseDOM && 'serviceWorker' in navigator

  useEffect(() => {
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
  }, [prefetchDefaultPages])

  useEffect(() => {
    addNavigationRouteModifier(normalizeNavigation)
  }, [addNavigationRouteModifier])

  const settings = getSettings(APP_LOCATOR) || {}
  const {
    titleTag,
    metaTagDescription,
    metaTagRobots,
    storeName,
    faviconLinks,
    enableOrderFormOptimization = false,
  } = settings

  const { canonicalHost, canonicalPath } = systemToCanonical(route)
  const description = (metaTags && metaTags.description) || metaTagDescription
  const title = pageTitle || titleTag

  const [queryMatch] = route.path.match(/\?.*/) || ['?']

  const canonicalLink =
    canonicalHost &&
    canonicalPath &&
    `https://${canonicalHost}${rootPath}${canonicalPath}`

  const parsedFavicons = useFavicons(faviconLinks)

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
          supportsServiceWorker && {
            type: 'text/javascript',
            src: `${rootPath}/pwa/workers/register.js${queryMatch}&scope=${encodeURIComponent(
              rootPath
            )}`,
            defer: true,
          },
        ].filter(Boolean)}
        link={[
          ...(parsedFavicons || []),
          ...(!amp && canonicalLink
            ? [
                /*{
                    rel: 'amphtml',
                    href: encodeURI(`${canonicalLink}?amp`),
                  },*/
                {
                  rel: 'canonical',
                  href: encodeURI(canonicalLink),
                },
              ]
            : []),
        ].filter(Boolean)}
      />
      <PixelProvider currency={currency}>
        <PWAProvider rootPath={rootPath}>
          <PageViewPixel title={title} />
          <UserDataPixel />
          <ToastProvider positioning="window">
            <NetworkStatusToast />
            {enableOrderFormOptimization ? (
              <StoreContent setCheckoutCookie>{children}</StoreContent>
            ) : (
              /** This is necessary for backwards compatibility, since stores
               *  might still need the OrderFormProvider from store-resources.
               *  If a store does not have `enableOrderFormOptimization` enabled,
               *  we should always add this provider.
               */
              <OrderFormProvider>
                <StoreContent setCheckoutCookie={false}>
                  {children}
                </StoreContent>
              </OrderFormProvider>
            )}
          </ToastProvider>
        </PWAProvider>
      </PixelProvider>
      {isStorefrontIframe && (
        <NoSSR>
          <ExtensionPoint id="highlight-overlay" />
        </NoSSR>
      )}
    </Fragment>
  )
}

StoreWrapper.propTypes = {
  children: PropTypes.element,
}

export default StoreWrapper

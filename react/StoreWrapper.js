/* eslint-disable react/jsx-filename-extension */
import React, { Fragment, useEffect, useMemo } from 'react'
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
import { useCanonicalLink } from './hooks/useCanonicalLink'

const APP_LOCATOR = 'vtex.store'
const CONTENT_TYPE = 'text/html; charset=utf-8'
const META_ROBOTS = 'index, follow'
const MOBILE_SCALING = 'width=device-width, initial-scale=1'
const CUSTOM_PAGE = 'store.custom'

const isSiteEditorIframe = () => {
  try {
    return (
      canUseDOM && window.top !== window.self && window.top.__provideRuntime
    )
  } catch {
    return false
  }
}

const getCustomPagesOpenGraph = ({ title, description, url }) => {
  return [
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:url', content: url },
    { property: 'og:description', content: description },
  ]
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

const StoreWrapper = ({ children, CustomContext }) => {
  const {
    amp,
    culture: { country, locale, currency },
    route,
    route: { metaTags, title: pageTitle, rootName },
    getSettings,
    rootPath = '',
    prefetchDefaultPages,
    addNavigationRouteModifier,
  } = useRuntime()
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
    enableServiceWorker = true,
  } = settings

  const description = (metaTags && metaTags.description) || metaTagDescription
  const title = pageTitle || titleTag
  const robots = (metaTags || {}).robots || metaTagRobots

  const [queryMatch] = route.path.match(/\?.*/) || ['?']

  const canonicalLink = useCanonicalLink()

  const parsedFavicons = useFavicons(faviconLinks)

  const CustomContextElement = CustomContext || Fragment

  const isCustomPage = useMemo(() => rootName.includes(CUSTOM_PAGE), [rootName])

  const content = (
    <OrderQueueProvider>
      <OrderFormProviderCheckout>
        <OrderItemsProvider>
          <WrapperContainer className="vtex-store__template bg-base">
            <CustomContextElement>{children}</CustomContextElement>
          </WrapperContainer>
        </OrderItemsProvider>
      </OrderFormProviderCheckout>
    </OrderQueueProvider>
  )
  return (
    <Fragment>
      <Helmet
        title={title}
        meta={[
          ...(isCustomPage
            ? getCustomPagesOpenGraph({
                title,
                description,
                url: canonicalLink,
              })
            : []),
          // viewport meta tag is already handled in render-server for AMP pages
          !amp && { name: 'viewport', content: MOBILE_SCALING },
          { name: 'description', content: description },
          { name: 'copyright', content: storeName },
          { name: 'author', content: storeName },
          { name: 'country', content: country },
          { name: 'language', content: locale },
          { name: 'currency', content: currency },
          { name: 'robots', content: robots || META_ROBOTS },
          { httpEquiv: 'Content-Type', content: CONTENT_TYPE },
        ]
          .filter(Boolean)
          .filter(meta => meta.content && meta.content.length > 0)}
        script={[
          supportsServiceWorker && {
            type: 'text/javascript',
            src: `${rootPath}/register.js${queryMatch}${
              enableServiceWorker ? '' : '&__disableSW=true'
            }&scope=${encodeURIComponent(rootPath)}`,
            defer: true,
          },
        ].filter(Boolean)}
        link={[
          ...(parsedFavicons || []),
          ...(!amp && canonicalLink
            ? [
                /* {
                    rel: 'amphtml',
                    href: encodeURI(`${canonicalLink}?amp`),
                  }, */
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
              content
            ) : (
              /** This is necessary for backwards compatibility, since stores
               *  might still need the OrderFormProvider from store-resources.
               *  If a store does not have `enableOrderFormOptimization` enabled,
               *  we should always add this provider.
               */
              <OrderFormProvider>{content}</OrderFormProvider>
            )}
          </ToastProvider>
        </PWAProvider>
      </PixelProvider>
      {isSiteEditorIframe() && (
        <NoSSR>
          <ExtensionPoint id="highlight-overlay" />
        </NoSSR>
      )}
    </Fragment>
  )
}

StoreWrapper.propTypes = {
  children: PropTypes.element,
  CustomContext: PropTypes.any,
}

export default StoreWrapper

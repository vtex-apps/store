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
import { OrderFormProvider as OrderFormProviderCheckout } from 'vtex.order-manager/OrderForm'

import PageViewPixel from './components/PageViewPixel'
import OrderFormProvider from './components/OrderFormProvider'
import NetworkStatusToast from './components/NetworkStatusToast'
import WrapperContainer from './components/WrapperContainer'

import { contains, map, path as ramdaPath, uniq, zip } from 'ramda'
import queryString from 'query-string'

const APP_LOCATOR = 'vtex.store'
const CONTENT_TYPE = 'text/html; charset=utf-8'
const META_ROBOTS = 'index, follow'
const MOBILE_SCALING = 'width=device-width, initial-scale=1'
const CATEGORY_TREE_MAX_DEPTH = 3

const normalizeQueryMap = (categoryTreeDepth, queryMap) => {
  const splitMap = queryMap.map && queryMap.map.split(',')
  const splitQuery = queryMap.query && queryMap.query.split('/').slice(1)
  const zippedMapQuery = zip(splitMap, splitQuery)

  const sorted =
    zippedMapQuery &&
    zippedMapQuery.slice(categoryTreeDepth).sort((tuple1, tuple2) => {
      const [, specFilterVal1] = tuple1[0].split('specificationFilter_')
      const [, specFilterVal2] = tuple2[0].split('specificationFilter_')
      const facetName1 = tuple1[1]
      const facetName2 = tuple2[1]
      return (
        Number(specFilterVal1) -
        Number(specFilterVal2) +
        facetName1.localeCompare(facetName2)
      )
    })

  const assembledSortedQuery = [
    ...zippedMapQuery.slice(0, categoryTreeDepth),
    ...uniq(sorted),
  ]

  queryMap.map = assembledSortedQuery.map(tuple => tuple[0]).join(',')
  queryMap.query = `/${assembledSortedQuery.map(tuple => tuple[1]).join('/')}`
}

export const normalizeNavigation = navigation => {
  const { path, query } = navigation
  if (ramdaPath(['__RUNTIME__', 'route', 'domain'], window) !== 'store') {
    return navigation
  }

  const queryMap = query ? queryString.parse(query) : {}
  if (queryMap && queryMap.map) {
    const pathSegments = path.startsWith('/')
      ? path.split('/').slice(1)
      : path.split('/')
    const mapValues = queryMap.map.split(',').slice(0, pathSegments.length)
    const convertedSegments = map(
      ([pathSegment, mapValue]) =>
        contains('specificationFilter', mapValue)
          ? pathSegment
          : pathSegment.toLowerCase(),
      zip(pathSegments, mapValues)
    )
    const categoryTreeDepth = Math.min(
      convertedSegments.length,
      CATEGORY_TREE_MAX_DEPTH
    )

    normalizeQueryMap(categoryTreeDepth, queryMap)
    navigation.query = queryString.stringify(queryMap, {
      encode: false,
    })

    navigation.path = path.startsWith('/')
      ? `/${convertedSegments.join('/')}`
      : convertedSegments.join('/')
    return navigation
  }

  navigation.path = navigation.path && navigation.path.toLowerCase()
  return navigation
}

const systemToCanonical = ({ canonicalPath }) => {
  const canonicalHost =
    window.__hostname__ || (window.location && window.location.hostname)
  return {
    canonicalPath,
    canonicalHost,
  }
}

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
  } = settings

  const { canonicalHost, canonicalPath } = systemToCanonical(route)
  const description = (metaTags && metaTags.description) || metaTagDescription
  const title = pageTitle || titleTag

  const [queryMatch] = route.path.match(/\?.*/) || ['?']

  const canonicalLink =
    canonicalHost &&
    canonicalPath &&
    `https://${canonicalHost}${rootPath}${
      canonicalPath ? canonicalPath.toLowerCase() : ''
    }`

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
          ...(faviconLinks || []),
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
          <ToastProvider positioning="window">
            <NetworkStatusToast />
            <OrderFormProvider>
              <OrderQueueProvider>
                <OrderFormProviderCheckout>
                  <WrapperContainer className="vtex-store__template bg-base">
                    {children}
                  </WrapperContainer>
                </OrderFormProviderCheckout>
              </OrderQueueProvider>
            </OrderFormProvider>
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

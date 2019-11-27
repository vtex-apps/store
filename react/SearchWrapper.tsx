import React, { Fragment, useState, useMemo, useEffect, FC, ReactElement } from 'react'
import { Helmet, useRuntime, LoadingContextProvider, canUseDOM } from 'vtex.render-runtime'

import { capitalize } from './modules/capitalize'
import useDataPixel from './hooks/useDataPixel'
import { usePageView } from './components/PageViewPixel'
import { getDepartmentMetadata, getCategoryMetadata, getSearchMetadata } from './modules/searchMetadata'
import { SearchQuery } from './modules/searchTypes'
import { PixelEvent } from './typings/event'

const APP_LOCATOR = 'vtex.store'

interface SearchRouteParams {
  term?: string
  department?: string
  category?: string
}

const pageCategory = (products: unknown[], params: SearchRouteParams) => {
  if (!products || products.length === 0) {
    return 'EmptySearch'
  }
  const { category, term } = params
  return term ? 'InternalSiteSearch' : category ? 'Category' : 'Department'
}

type PageEventName = 'internalSiteSearchView' | 'categoryView' | 'departmentView' | 'emptySearchView'

const mapEvent = {
  InternalSiteSearch: 'internalSiteSearchView',
  Category: 'categoryView',
  Department: 'departmentView',
  EmptySearch: 'emptySearchView',
}
const fallbackView = 'otherView'

const getPageEventName = (products: unknown[], params: SearchRouteParams) : PageEventName => {
  if (!products || products.length === 0) {
    return fallbackView as PageEventName
  }
  const category = pageCategory(products, params)

  return (mapEvent[category] || fallbackView) as PageEventName
}

const getTitleTag = (titleTag: string, storeTitle: string, term?: string) => {
  return titleTag
    ? `${titleTag} - ${storeTitle}`
    : term
    ? `${capitalize(decodeURI(term))} - ${storeTitle}`
    : `${storeTitle}`
}

const getSearchIdentifier = (searchQuery: SearchQuery) => {
  const variables = searchQuery.variables
  if (!variables) {
    return
  }
  const { query, map } = variables
  return query + map
}

interface SearchPageInfoEvent {
  department?: DepartmentMetadata | null
  category?: CategoryMetadata | null
  search?: SearchMetadata | null
}

interface DepartmentMetadata {
  id: string
  name: string
}

interface CategoryMetadata {
  id: string
  name: string
}

interface SearchMetadata {
  term: string
  category: string | null
  results: number
}

interface SearchWrapperProps {
  children: ReactElement,
  params: SearchRouteParams,
  searchQuery: SearchQuery
}

const SearchWrapper: FC<SearchWrapperProps> = props => {
  const {
    params,
    searchQuery,
    searchQuery: {
      loading = true,
      data: { searchMetadata: { titleTag = '', metaTagDescription = '' } = {} } = {},
    } = {},
    children,
  } = props
  const { account, getSettings } = useRuntime()
  const settings = getSettings(APP_LOCATOR) || {}
  const { titleTag: defaultStoreTitle, storeName } = settings
  const title = getTitleTag(
    titleTag,
    storeName || defaultStoreTitle,
    params.term
  )

  const pixelEvents = useMemo(() => {
    if (
      !searchQuery ||
      !canUseDOM ||
      !searchQuery.products
    ) {
      return null
    }

    const { products } = searchQuery

    const event = getPageEventName(products, params)

    const pageInfoEvent: SearchPageInfoEvent & PixelEvent = {
      event: 'pageInfo',
      eventType: event,
      accountName: account,
      pageTitle: title,
      pageUrl: window.location.href,
      category: searchQuery && searchQuery.data ? getCategoryMetadata(searchQuery.data) : null,
      department: searchQuery && searchQuery.data ? getDepartmentMetadata(searchQuery.data) : null,
      search: searchQuery && searchQuery.data ? getSearchMetadata(searchQuery.data) : null,
    }

    return [
      pageInfoEvent,
      {
        event,
        products,
      },
    ]
  }, [account, params, searchQuery, title])

  const [hasLoaded, setHasLoaded] = useState(true)

  const loadingValue = useMemo(
    () => ({
      isParentLoading: loading && hasLoaded,
    }),
    [loading, hasLoaded]
  )

  const pixelCacheKey = getSearchIdentifier(searchQuery)
  usePageView({ title, cacheKey: pixelCacheKey })
  useDataPixel(pixelEvents, pixelCacheKey, loading)

  /** Prevents the loader from showing up after initial data is loaded,
   * e.g. when setQuery changes the query variables */
  useEffect(() => {
    if (!loading) {
      setHasLoaded(false)
    }
  }, [loading])

  return (
    <Fragment>
      <Helmet
        title={title}
        meta={[
          params.term && {
            name: 'robots',
            content: 'noindex,follow',
          },
          metaTagDescription && {
            name: 'description',
            content: metaTagDescription,
          },
        ].filter(Boolean)}
      />
      <LoadingContextProvider value={loadingValue}>
        {React.cloneElement(children, props)}
      </LoadingContextProvider>
    </Fragment>
  )
}

export default SearchWrapper

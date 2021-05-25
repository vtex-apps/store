import React, {
  Fragment,
  useState,
  useMemo,
  useEffect,
  FC,
  ReactElement,
  ComponentType,
} from 'react'
import {
  Helmet,
  useRuntime,
  LoadingContextProvider,
  canUseDOM,
  RuntimeWithRoute,
} from 'vtex.render-runtime'
import { SearchOpenGraph } from 'vtex.open-graph'
import { ProductList as ProductListStructuredData } from 'vtex.structured-data'

import { capitalize } from './modules/capitalize'
import useDataPixel from './hooks/useDataPixel'
import { usePageView } from './components/PageViewPixel'
import {
  getDepartmentMetadata,
  getCategoryMetadata,
  getSearchMetadata,
} from './modules/searchMetadata'
import { SearchQuery } from './modules/searchTypes'
import { PixelEvent } from './typings/event'
import { useCanonicalLink } from './hooks/useCanonicalLink'

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

type PageEventName =
  | 'internalSiteSearchView'
  | 'categoryView'
  | 'departmentView'
  | 'emptySearchView'

const mapEvent = {
  InternalSiteSearch: 'internalSiteSearchView',
  Category: 'categoryView',
  Department: 'departmentView',
  EmptySearch: 'emptySearchView',
}
const fallbackView = 'otherView'

const getPageEventName = (
  products: unknown[],
  params: SearchRouteParams
): PageEventName => {
  if (!products) {
    return fallbackView as PageEventName
  }

  const category = pageCategory(products, params)

  return (mapEvent[category] || fallbackView) as PageEventName
}

interface GetTitleTagParams {
  titleTag: string
  storeTitle: string
  term?: string
  pageTitle?: string
}

const getTitleTag = ({
  titleTag,
  storeTitle,
  term,
  pageTitle,
}: GetTitleTagParams) => {
  if (titleTag) {
    try {
      return `${decodeURIComponent(titleTag)} - ${storeTitle}`
    } catch {
      return `${titleTag} - ${storeTitle}`
    }
  }

  if (pageTitle) {
    return `${decodeURIComponent(pageTitle)} - ${storeTitle}`
  }

  return term
    ? `${capitalize(decodeURIComponent(term))} - ${storeTitle}`
    : `${storeTitle}`
}

const getSearchIdentifier = (
  searchQuery: SearchQuery,
  orderBy?: string,
  page?: string
) => {
  const { variables } = searchQuery

  if (!variables) {
    return
  }
  const { query, map } = variables
  return query + map + (orderBy ?? '') + (page ?? '')
}

function getCanonicalMaybeWithPage(canonicalLink: string, page: number) {
  if (page <= 0) {
    return null
  }

  const canonicalWithPage = `${canonicalLink}?page=${page}`

  return canonicalWithPage
}

function getHelmetLink(
  canonicalLink: string | null,
  page: number,
  rel: 'canonical' | 'prev' | 'next'
) {
  if (!canonicalLink) {
    return null
  }

  let pageAfterTransformation = 0

  if (rel === 'canonical') {
    pageAfterTransformation = page
  } else if (rel === 'next') {
    pageAfterTransformation = page + 1
  } else if (rel === 'prev') {
    pageAfterTransformation = page - 1
  }

  if (pageAfterTransformation === 1) {
    return {
      rel,
      href: encodeURI(canonicalLink),
    }
  }

  const canonicalMaybeWithPage = getCanonicalMaybeWithPage(
    canonicalLink,
    pageAfterTransformation
  )

  if (!canonicalMaybeWithPage) {
    return null
  }

  return {
    rel,
    href: encodeURI(canonicalMaybeWithPage),
  }
}

function isNotLastPage(
  products: SearchQuery['products'],
  to: number | undefined,
  recordsFiltered: number | undefined
) {
  if (
    !products ||
    to === undefined ||
    to === null ||
    recordsFiltered === undefined ||
    recordsFiltered === null
  ) {
    return null
  }

  return to + 1 < recordsFiltered
}

interface AppliedFilters {
  name: string
}

interface SearchPageInfoEvent {
  department?: DepartmentMetadata | null
  category?: CategoryMetadata | null
  search?: SearchMetadata | null
  orderBy?: string
  page?: string
  appliedFilters?: AppliedFilters[]
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
  category: CategoryMetadata | null
  results: number
}

interface SearchWrapperProps {
  children: ReactElement
  params: SearchRouteParams
  searchQuery: SearchQuery
  orderBy?: string
  to?: number
  page?: number
  CustomContext?: ComponentType
}

const SearchWrapper: FC<SearchWrapperProps> = props => {
  const {
    params,
    orderBy,
    searchQuery,
    searchQuery: {
      variables: { map } = {},
      data: {
        searchMetadata: { titleTag = '', metaTagDescription = '' } = {},
        productSearch: { recordsFiltered = undefined } = {},
      } = {},
    } = {},
    CustomContext,
    page: pageFromQuery = 0,
    to,
    children,
  } = props
  const {
    account,
    getSettings,
    query: { page },
    route: { title: pageTitle, metaTags },
  } = useRuntime() as RuntimeWithRoute
  const settings = getSettings(APP_LOCATOR) || {}
  const loading = searchQuery ? searchQuery.loading : undefined
  const { titleTag: defaultStoreTitle, storeName } = settings
  const title = getTitleTag({
    titleTag,
    storeTitle: storeName || defaultStoreTitle,
    term: params.term,
    pageTitle,
  })

  const canonicalLink = useCanonicalLink()

  const openGraphParams = {
    title,
    description: metaTagDescription || metaTags?.description,
  }

  const pixelEvents = useMemo(() => {
    if (
      !searchQuery ||
      !canUseDOM ||
      !searchQuery.products ||
      !searchQuery.data?.facets?.queryArgs
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
      orderBy,
      appliedFilters: map?.split(',').map(name => ({ name })),
      page,
      category: searchQuery?.data
        ? getCategoryMetadata(searchQuery.data)
        : null,
      department: searchQuery?.data
        ? getDepartmentMetadata(searchQuery.data)
        : null,
      search: searchQuery?.data ? getSearchMetadata(searchQuery.data) : null,
    }

    return [
      pageInfoEvent,
      {
        event,
        products,
      },
    ]
  }, [account, params, searchQuery, title, orderBy, page, map])

  const [hasLoaded, setHasLoaded] = useState(true)

  const loadingValue = useMemo(
    () => ({
      isParentLoading: loading && hasLoaded,
    }),
    [loading, hasLoaded]
  )

  const pixelCacheKey = getSearchIdentifier(searchQuery, orderBy, page)
  usePageView({ title, cacheKey: pixelCacheKey })
  useDataPixel(pixelEvents, pixelCacheKey, loading)

  /** Prevents the loader from showing up after initial data is loaded,
   * e.g. when setQuery changes the query variables */
  useEffect(() => {
    if (!loading) {
      setHasLoaded(false)
    }
  }, [loading])

  const CustomContextElement = CustomContext ?? Fragment

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
        link={[
          getHelmetLink(canonicalLink, pageFromQuery, 'canonical'),
          getHelmetLink(canonicalLink, pageFromQuery, 'prev'),
          isNotLastPage(searchQuery.products, to, recordsFiltered)
            ? getHelmetLink(canonicalLink, pageFromQuery, 'next')
            : null,
        ].filter(Boolean)}
      />

      <ProductListStructuredData products={searchQuery.products} />
      <SearchOpenGraph meta={openGraphParams} />
      <LoadingContextProvider value={loadingValue}>
        <CustomContextElement>
          {React.cloneElement(children, props)}
        </CustomContextElement>
      </LoadingContextProvider>
    </Fragment>
  )
}

export default SearchWrapper

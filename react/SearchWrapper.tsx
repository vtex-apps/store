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
  StoreSettings,
} from 'vtex.render-runtime'
import { SearchOpenGraph } from 'vtex.open-graph'
import queryString from 'query-string'

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

const getDecodeURIComponent = (encodedURIComponent: string) => {
  try {
    return decodeURIComponent(encodedURIComponent)
  } catch {
    return encodedURIComponent
  }
}

interface GetTitleTagParams {
  titleTag: string
  storeTitle: string
  term?: string
  pageTitle?: string
  pageNumber?: number
  removeStoreNameTitle?: boolean
}

const getTitleTag = ({
  titleTag,
  storeTitle,
  term,
  pageTitle,
  pageNumber = 0,
  removeStoreNameTitle,
}: GetTitleTagParams) => {
  /*
  titleNumber and storeTitleFormatted depend on the value of enablePageNumberTitle and removeStoreNameTitle params,
  by default, the value of enablePageNumberTitle and removeStoreNameTitle is false, only if the value of these
  parameters is true, it will affect the value of titleNumber or storeTitleFormatted
  */
  const titleNumber = pageNumber > 0 ? ` #${pageNumber}` : ''
  const storeTitleFormatted = removeStoreNameTitle ? '' : ` - ${storeTitle}`

  if (titleTag) {
    return `${getDecodeURIComponent(
      titleTag
    )}${titleNumber}${storeTitleFormatted}`
  }

  if (pageTitle) {
    return `${getDecodeURIComponent(
      pageTitle
    )}${titleNumber}${storeTitleFormatted}`
  }

  if (term) {
    return `${capitalize(
      getDecodeURIComponent(term)
    )}${titleNumber}${storeTitleFormatted}`
  }

  return storeTitle
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

interface GetSearchCanonicalParams {
  canonicalLink: string
  page?: number
  map?: string
  term?: string
}

function shouldNotIncludeMap(map?: string) {
  if (!map || map === 'b' || map === 'brand') {
    return true
  }

  const mapTree = map.split(',')

  if (mapTree.length > 4) {
    return false
  }

  return mapTree.every(mapItem => mapItem === 'c')
}

function getSearchCanonical({
  canonicalLink,
  page,
  map,
  term,
}: GetSearchCanonicalParams) {
  if (page !== null && page !== undefined && page < 1) {
    return null
  }

  const query = {
    page: page !== undefined && page !== null && page > 1 ? page : undefined,
    map: shouldNotIncludeMap(map) ? undefined : map,
    _q: term,
  }

  const canonicalWithPage = queryString.stringifyUrl({
    url: decodeURI(canonicalLink),
    query,
  })

  return canonicalWithPage
}

interface GetHelmetLinkParams {
  canonicalLink: string | null
  page: number
  map?: string
  term?: string
  rel: 'canonical' | 'prev' | 'next'
}

export function getHelmetLink({
  canonicalLink,
  page,
  map,
  rel,
  term,
}: GetHelmetLinkParams) {
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

  const canonicalWithParams = getSearchCanonical({
    canonicalLink,
    page: pageAfterTransformation,
    map,
    term,
  })

  if (!canonicalWithParams) {
    return null
  }

  return {
    rel,
    href: canonicalWithParams,
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
  term?: string
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
  facetsLoading?: boolean
}

const SearchWrapper: FC<SearchWrapperProps> = props => {
  const {
    params,
    orderBy,
    searchQuery,
    facetsLoading,
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
    query: { page, _q: termFromQuery },
    route: { title: pageTitle, metaTags },
  } = useRuntime() as RuntimeWithRoute

  const settings = getSettings(APP_LOCATOR) || ({} as StoreSettings)
  const loading = searchQuery ? searchQuery.loading : undefined
  const {
    titleTag: defaultStoreTitle,
    storeName,
    enablePageNumberTitle = false,
    canonicalWithoutUrlParams = false,
    removeStoreNameTitle = false,
  } = settings

  const title = getTitleTag({
    titleTag,
    storeTitle: storeName || defaultStoreTitle,
    term: params.term,
    pageTitle,
    pageNumber: enablePageNumberTitle ? Number(page) : 0,
    removeStoreNameTitle,
  })

  const canonicalLink = useCanonicalLink()

  const helmetCanonicalLink = getHelmetLink({
    canonicalLink,
    page: pageFromQuery,
    map: canonicalWithoutUrlParams ? '' : map,
    term: termFromQuery,
    rel: 'canonical',
  })

  const openGraphParams = {
    title,
    description: metaTagDescription || metaTags?.description,
    canonical: helmetCanonicalLink?.href,
  }

  const pixelEvents = useMemo(() => {
    if (
      !searchQuery ||
      !canUseDOM ||
      !searchQuery.products ||
      !searchQuery.data?.facets?.queryArgs ||
      facetsLoading
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
  }, [searchQuery, facetsLoading, params, account, title, orderBy, map, page])

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
          helmetCanonicalLink,
          getHelmetLink({
            canonicalLink,
            page: pageFromQuery,
            map,
            rel: 'prev',
          }),
          isNotLastPage(searchQuery.products, to, recordsFiltered)
            ? getHelmetLink({
                canonicalLink,
                page: pageFromQuery,
                map,
                rel: 'next',
              })
            : null,
        ].filter(Boolean)}
      />

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

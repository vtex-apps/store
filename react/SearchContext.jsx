/* eslint-disable no-restricted-imports */
import PropTypes from 'prop-types'
import { path } from 'ramda'
import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import SearchQuery from 'vtex.search-result/SearchQuery'

import { initializeMap, SORT_OPTIONS } from './modules/search'

const DEFAULT_MAX_ITEMS_PER_PAGE = 10

const trimStartingSlash = value => value && value.replace(/^\//, '')

const SearchContext = ({
  nextTreePath,
  params,
  maxItemsPerPage = DEFAULT_MAX_ITEMS_PER_PAGE,
  queryField,
  mapField,
  orderByField,
  hideUnavailableItems,
  facetsBehavior = 'Static',
  __unstableCategoryTreeBehavior = 'default',
  skusFilter,
  simulationBehavior,
  installmentCriteria,
  excludedPaymentSystems,
  includedPaymentSystems,
  sponsoredProductsBehavior = 'sync',
  query: {
    order: orderBy = orderByField || SORT_OPTIONS[0].value,
    page: pageQuery,
    map: mapQuery,
    priceRange,
    // backwards-compatibility
    rest,
    fuzzy,
    operator,
    searchState,
  },
  children,
  __unstableProductOriginVtex,
}) => {
  const {
    page: runtimePage,
    query: runtimeQuery,
    route: {
      queryString: { map: renderMap },
    },
  } = useRuntime()

  const fieldsFromQueryString = {
    mapField: runtimeQuery.map,
    queryField: trimStartingSlash(runtimeQuery.query),
  }

  const areFieldsFromQueryStringValid = !!(
    fieldsFromQueryString.mapField && fieldsFromQueryString.queryField
  )

  const map = areFieldsFromQueryStringValid
    ? fieldsFromQueryString.mapField
    : renderMap || mapQuery || initializeMap(params)

  // Remove params which don't compose a search path
  const { id, ...searchParams } = params
  const query = Object.values(searchParams)
    .filter(term => term && term.length > 0)
    .join('/')
    .replace(/\/\//g, '/') // This cleans some bad cases of two // on some terms.

  const getCorrectQueryValue = () => {
    let queryValue = query

    // Checks if this is on the format of preventRouteChange and get the correct data
    if (areFieldsFromQueryStringValid) {
      queryValue = fieldsFromQueryString.queryField
    }

    // Normal query format, without preventRouteChange
    else if (queryField) {
      queryValue = queryField
    }

    // Legacy search
    else if (rest && rest.length > 0) {
      queryValue = `${query}/${rest.replace(',', '/')}`
    }

    try {
      return decodeURI(queryValue)
    } catch {
      return queryValue
    }
  }

  const queryValue = getCorrectQueryValue()
  const mapValue = queryField ? mapField : map
  const state =
    (typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem('searchState')) ||
    searchState

  return (
    <SearchQuery
      maxItemsPerPage={maxItemsPerPage}
      query={queryValue}
      map={mapValue}
      orderBy={orderBy}
      priceRange={priceRange}
      hideUnavailableItems={hideUnavailableItems}
      facetsBehavior={facetsBehavior}
      categoryTreeBehavior={__unstableCategoryTreeBehavior}
      pageQuery={pageQuery}
      skusFilter={skusFilter}
      simulationBehavior={simulationBehavior}
      installmentCriteria={installmentCriteria}
      excludedPaymentSystems={excludedPaymentSystems}
      includedPaymentSystems={includedPaymentSystems}
      operator={operator}
      fuzzy={fuzzy}
      searchState={state}
      __unstableProductOriginVtex={__unstableProductOriginVtex}
      sponsoredProductsBehavior={sponsoredProductsBehavior}
    >
      {(searchQuery, extraParams) => {
        return React.cloneElement(children, {
          searchQuery: {
            ...searchQuery,
            // backwards-compatibility
            data: {
              ...(searchQuery.data || {}),
              products: path(
                ['data', 'productSearch', 'products'],
                searchQuery
              ),
            },
            facets: path(['data', 'facets'], searchQuery),
            products: path(['data', 'productSearch', 'products'], searchQuery),
            recordsFiltered: path(
              ['data', 'productSearch', 'recordsFiltered'],
              searchQuery
            ),
          },
          searchContext: runtimePage,
          pagesPath: nextTreePath,
          map,
          orderBy,
          priceRange,
          page: extraParams.page,
          from: extraParams.from,
          to: extraParams.to,
          facetsLoading: extraParams.facetsLoading,
          maxItemsPerPage,
          // backwards-compatibility
          rest,
          lazyItemsRemaining: extraParams.lazyItemsRemaining,
        })
      }}
    </SearchQuery>
  )
}

SearchContext.propTypes = {
  /** Route parameters */
  params: PropTypes.shape({
    category: PropTypes.string,
    department: PropTypes.string,
    term: PropTypes.string,
    id: PropTypes.string,
  }),
  /** Query params */
  query: PropTypes.shape({
    map: PropTypes.string,
    page: PropTypes.string,
    order: PropTypes.oneOf(SORT_OPTIONS.map(o => o.value)),
    priceRange: PropTypes.string,
    rest: PropTypes.any,
    operator: PropTypes.string,
    fuzzy: PropTypes.string,
    searchState: PropTypes.string,
  }),
  /** Custom query `query` param */
  queryField: PropTypes.string,
  /** Custom query `map` param */
  mapField: PropTypes.string,
  /** Custom query `orderBy` param */
  orderByField: PropTypes.string,
  /** Current extension point name */
  nextTreePath: PropTypes.string,
  /** Component to be rendered */
  children: PropTypes.node.isRequired,
  /** Max items to show per result page */
  maxItemsPerPage: PropTypes.number,
  hideUnavailableItems: PropTypes.bool,
  facetsBehavior: PropTypes.string,
  __unstableCategoryTreeBehavior: PropTypes.string,
  skusFilter: PropTypes.string,
  simulationBehavior: PropTypes.string,
  installmentCriteria: PropTypes.string,
  excludedPaymentSystems: PropTypes.string,
  includedPaymentSystems: PropTypes.string,
  __unstableProductOriginVtex: PropTypes.bool,
  sponsoredProductsBehavior: PropTypes.string,
}

SearchContext.schema = {
  title: 'admin/editor.product-search.title',
  type: 'object',
  properties: {
    maxItemsPerPage: {
      title: 'admin/editor.product-search.maxItemsPerPage',
      type: 'number',
    },
    queryField: {
      title: 'Query',
      type: 'string',
    },
    mapField: {
      title: 'Map',
      type: 'string',
    },
    orderByField: {
      title: 'Order by field',
      type: 'string',
      default: SORT_OPTIONS[0].value,
      enum: SORT_OPTIONS.map(opt => opt.value),
      enumNames: SORT_OPTIONS.map(opt => opt.label),
    },
    hideUnavailableItems: {
      title: 'admin/editor.product-search.hideUnavailableItems',
      type: 'boolean',
      default: false,
    },
    sponsoredProductsBehavior: {
      title: 'Sponsored products behavior',
      type: 'string',
      default: 'sync',
    },
  },
}

export default SearchContext

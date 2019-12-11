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
  skusFilter,
  query: {
    order: orderBy = orderByField || SORT_OPTIONS[0].value,
    page: pageQuery,
    map: mapQuery,
    priceRange,
    // backwards-compatibility
    rest,
  },
  children,
}) => {
  const { page: runtimePage, query: runtimeQuery } = useRuntime()

  const fieldsFromQueryString = {
    mapField: runtimeQuery.map,
    queryField: trimStartingSlash(runtimeQuery.query),
  }

  const areFieldsFromQueryStringValid = !!(
    fieldsFromQueryString.mapField && fieldsFromQueryString.queryField
  )

  const map = areFieldsFromQueryStringValid
    ? fieldsFromQueryString.mapField
    : mapQuery || initializeMap(params)

  // Remove params which don't compose a search path
  const { id, ...searchParams } = params
  const query = Object.values(searchParams)
    .filter(term => term && term.length > 0)
    .join('/')
    .replace(/\/\//g, '/') //This cleans some bad cases of two // on some terms.

  const getCorrectQueryValue = () => {
    // Checks if this is on the format of preventRouteChange and get the correct data
    if (areFieldsFromQueryStringValid) {
      return fieldsFromQueryString.queryField
    }
    // Normal query format, without preventRouteChange
    if (queryField) {
      return queryField
    }
    // Legacy search
    if (rest && rest.length > 0) {
      return `${query}/${rest.replace(',', '/')}`
    }
    return query
  }

  const queryValue = getCorrectQueryValue()
  const mapValue = queryField ? mapField : map

  return (
    <SearchQuery
      maxItemsPerPage={maxItemsPerPage}
      query={queryValue}
      map={mapValue}
      orderBy={orderBy}
      priceRange={priceRange}
      hideUnavailableItems={hideUnavailableItems}
      pageQuery={pageQuery}
      skusFilter={skusFilter}
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
  }),
  /** Query params */
  query: PropTypes.shape({
    map: PropTypes.string,
    page: PropTypes.string,
    order: PropTypes.oneOf(SORT_OPTIONS.map(o => o.value)),
    priceRange: PropTypes.string,
    rest: PropTypes.any,
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
  },
}

export default SearchContext

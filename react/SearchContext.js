import PropTypes from 'prop-types'
import { path } from 'ramda'
import React from 'react'
import { useRuntime } from 'vtex.render-runtime'

import SearchQuery from 'vtex.search-result/SearchQuery'

import { initializeMap, SORT_OPTIONS } from './utils/search'

const DEFAULT_MAX_ITEMS_PER_PAGE = 10

const SearchContext = ({
  nextTreePath,
  params,
  maxItemsPerPage = DEFAULT_MAX_ITEMS_PER_PAGE,
  queryField,
  mapField,
  orderByField,
  hideUnavailableItems,
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
  const { page: runtimePage } = useRuntime()
  const map = mapQuery || initializeMap(params)

  const query = Object.values(params)
    .filter(term => term && term.length > 0)
    .join('/')
    .replace(/\/\//g, '/') //This cleans some bad cases of two // on some terms.

  const queryValue = queryField
    ? queryField
    : rest && rest.length > 0
    ? `${query}/${rest.replace(',', '/')}`
    : query
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
    order: PropTypes.oneOf(SORT_OPTIONS.map(o => o.value)),
    priceRange: PropTypes.string,
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

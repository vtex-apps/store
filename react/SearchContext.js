import PropTypes from 'prop-types'
import { path, zip } from 'ramda'
import React from 'react'
import { Query } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import { productSearchV2 } from 'vtex.store-resources/Queries'
import { initializeMap, SORT_OPTIONS } from './utils/search'

const DEFAULT_PAGE = 1
const DEFAULT_MAX_ITEMS_PER_PAGE = 10

const SearchContext = ({
  nextTreePath,
  params,
  maxItemsPerPage = DEFAULT_MAX_ITEMS_PER_PAGE,
  queryField,
  mapField,
  orderByField,
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
  const page = pageQuery ? parseInt(pageQuery) : DEFAULT_PAGE
  const from = (page - 1) * maxItemsPerPage
  const to = from + maxItemsPerPage - 1

  const includeFacets = (map, query) =>
    !!(map && map.length > 0 && query && query.length > 0)

  const query = Object.values(params)
    .filter(term => term && term.length > 0)
    .join('/')

  const defaultSearch = {
    query:
      rest && rest.length > 0 ? `${query}/${rest.replace(',', '/')}` : query,
    map,
    orderBy,
    priceRange,
    from,
    to,
    rest,
    // hideUnavailableItems,
  }

  const customSearch = {
    query: queryField,
    map: mapField,
    orderBy,
    priceRange,
    from,
    to,
    // hideUnavailableItems,
  }

  const queryVariables = queryField ? customSearch : defaultSearch

  const { map: facetMap, query: facetQuery } = zip(
    queryVariables.query.split('/'),
    queryVariables.map.split(',')
  )
    .filter(([_, map]) => map === 'c' || map === 'ft')
    .reduce(
      ({ query: queryArr, map: mapArr }, [query, map]) => ({
        query: [...queryArr, query],
        map: [...mapArr, map],
      }),
      { map: [], query: [] }
    )

  queryVariables.facetQuery = facetQuery.join('/')
  queryVariables.facetMap = facetMap.join(',')
  queryVariables.withFacets = includeFacets(facetMap, facetQuery)

  return (
    <Query
      query={productSearchV2}
      variables={queryVariables}
      notifyOnNetworkStatusChange
      partialRefetch
    >
      {searchQuery => {
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
          page,
          from,
          to,
          // backwards-compatibility
          rest,
        })
      }}
    </Query>
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
    }
  },
}

export default SearchContext

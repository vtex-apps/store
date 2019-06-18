import PropTypes from 'prop-types'
import { path, zip, split, head, join, tail } from 'ramda'
import React, { useMemo } from 'react'
import { Query } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import { productSearchV2 } from 'vtex.store-resources/Queries'
import { initializeMap, SORT_OPTIONS } from './utils/search'

const DEFAULT_PAGE = 1
const DEFAULT_MAX_ITEMS_PER_PAGE = 10

const QUERY_SEPARATOR = '/'
const MAP_SEPARATOR = ','

const splitQuery = split(QUERY_SEPARATOR)
const splitMap = split(MAP_SEPARATOR)
const joinQuery = join(QUERY_SEPARATOR)
const joinMap = join(MAP_SEPARATOR)

const includeFacets = (map, query) =>
  !!(map && map.length > 0 && query && query.length > 0)

const useFacetsArgs = (query, map) => {
  return useMemo(() => {
    const queryArray = splitQuery(query)
    const mapArray = splitMap(map)
    const queryAndMap = zip(queryArray, mapArray)
    const relevantArgs = [
      head(queryAndMap),
      ...tail(queryAndMap).filter(
        ([_, tupleMap]) => tupleMap === 'c' || tupleMap === 'ft'
      ),
    ]
    const { finalMap, finalQuery } = relevantArgs.reduce(
      (accumulator, [tupleQuery, tupleMap]) => {
        accumulator.finalQuery.push(tupleQuery)
        accumulator.finalMap.push(tupleMap)
        return accumulator
      },
      { finalQuery: [], finalMap: [] }
    )
    const facetQuery = joinQuery(finalQuery)
    const facetMap = joinMap(finalMap)
    return {
      facetQuery,
      facetMap,
      withFacets: includeFacets(facetMap, facetQuery),
    }
  }, [map, query])
}

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
  const page = pageQuery ? parseInt(pageQuery) : DEFAULT_PAGE
  const from = (page - 1) * maxItemsPerPage
  const to = from + maxItemsPerPage - 1

  const query = Object.values(params)
    .filter(term => term && term.length > 0)
    .join('/')
    .replace(/\/\//g, '/') //This cleans some bad cases of two // on some terms.

  const defaultSearch = {
    query:
      rest && rest.length > 0 ? `${query}/${rest.replace(',', '/')}` : query,
    map,
    orderBy,
    priceRange,
    from,
    to,
    rest,
    hideUnavailableItems,
  }

  const customSearch = {
    query: queryField,
    map: mapField,
    orderBy,
    priceRange,
    from,
    to,
    hideUnavailableItems,
  }

  const queryVariables = queryField ? customSearch : defaultSearch
  const facetsArgs = useFacetsArgs(queryVariables.query, queryVariables.map)
  const variablesWithFacets = {
    ...queryVariables,
    ...facetsArgs,
  }
  return (
    <Query
      query={productSearchV2}
      variables={variablesWithFacets}
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
          maxItemsPerPage,
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

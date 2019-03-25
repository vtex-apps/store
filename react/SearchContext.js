import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { withRuntimeContext } from 'vtex.render-runtime'

import { search } from 'vtex.store-resources/Queries'
import { createInitialMap, SORT_OPTIONS } from './utils/search'

const DEFAULT_PAGE = 1
const DEFAULT_MAX_ITEMS_PER_PAGE = 10

class SearchContext extends Component {
  static propTypes = {
    /** Route parameters */
    params: PropTypes.shape({
      category: PropTypes.string,
      department: PropTypes.string,
      term: PropTypes.string,
    }),
    /** Render runtime context */
    runtime: PropTypes.shape({
      page: PropTypes.string.isRequired,
    }),
    /** Query params */
    query: PropTypes.shape({
      map: PropTypes.string,
      rest: PropTypes.string,
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
    maxItemsPerPage: PropTypes.number.isRequired,
  }

  static defaultProps = {
    maxItemsPerPage: DEFAULT_MAX_ITEMS_PER_PAGE,
  }

  static schema = {
    title: 'editor.product-search.title',
    type: 'object',
    properties: {
      maxItemsPerPage: {
        title: 'editor.product-search.maxItemsPerPage',
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
      restField: {
        title: 'Other Query Strings',
        type: 'string',
      },
      orderByField: {
        title: 'Order by field',
        type: 'string',
        default: SORT_OPTIONS[0].value,
        enum: SORT_OPTIONS.map(opt => opt.value),
        enumNames: SORT_OPTIONS.map(opt => opt.label),
      },
    },
  }

  render() {
    const {
      nextTreePath,
      params,
      maxItemsPerPage,
      queryField,
      mapField,
      orderByField,
      query: {
        order: orderBy = orderByField || SORT_OPTIONS[0].value,
        page: pageQuery,
        map: mapQuery,
        priceRange,
      },
      runtime: { page: runtimePage },
      ...props
    } = this.props

    const map = mapQuery || createInitialMap(params)
    const page = pageQuery ? parseInt(pageQuery) : DEFAULT_PAGE
    const from = (page - 1) * maxItemsPerPage
    const to = from + maxItemsPerPage - 1

    const includeFacets = (map, query) =>
      !!(map && map.length > 0 && query && query.length > 0)

    const query = Object.values(params)
      .filter(s => s.length > 0)
      .join('/')

    const defaultSearch = {
      query,
      map,
      orderBy,
      priceRange,
      from,
      to,
      withFacets: includeFacets(map, query),
    }

    const customSearch = {
      query: queryField,
      map: mapField,
      orderBy,
      priceRange,
      from,
      to,
      withFacets: includeFacets(mapField, queryField),
    }

    return (
      <Query
        query={search}
        variables={queryField ? customSearch : defaultSearch}
        notifyOnNetworkStatusChange
        partialRefetch
      >
        {searchQuery => {
          const { data } = searchQuery
          const { search } = data || {}

          return React.cloneElement(this.props.children, {
            ...props,
            searchQuery: {
              ...searchQuery,
              ...search,
            },
            searchContext: runtimePage,
            pagesPath: nextTreePath,
            map,
            orderBy,
            priceRange,
            page,
            from,
            to,
          })
        }}
      </Query>
    )
  }
}

export default withRuntimeContext(SearchContext)

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Query } from 'react-apollo'

import { searchQueryPropTypes } from '../constants/propTypes'
import { SearchQueryContext } from '../constants/searchContext'
import SortOptions from '../constants/searchSortOptions'
import { createMap, joinPathWithRest, reversePagesPath } from '../helpers/searchHelpers'
import facetsQuery from '../queries/facetsQuery.gql'
import searchQuery from '../queries/searchQuery.gql'

const DEFAULT_PAGE = 1
const DEFAULT_MAX_ITEMS_PER_PAGE = 1

class SearchQueryContainer extends Component {
  state = {
    maxItemsPerPage: DEFAULT_MAX_ITEMS_PER_PAGE,
    /* Will be loading by default. The container will wait until the real data arrives */
    loading: true,
  }

  static propTypes = {
    /** Query params */
    params: PropTypes.shape({
      /** Department param */
      department: PropTypes.string,
      /** Brand name */
      brand: PropTypes.string,
      /** Search's term, e.g: eletronics. */
      term: PropTypes.string,
      /** Category param */
      category: PropTypes.string,
      /** Subcategory param */
      subcategory: PropTypes.string,
    }),
    ...searchQueryPropTypes,
    /** Children to be rendered */
    children: PropTypes.node.isRequired,
  }

  render() {
    const {
      nextTreePath,
      params,
      query: {
        order: orderBy = SortOptions[0].value,
        page: pageProps,
        map: mapProps,
        rest = '',
      },
    } = this.props

    const path = reversePagesPath(params)
    const map = mapProps || createMap(path, rest)
    const page = pageProps ? parseInt(pageProps) : DEFAULT_PAGE
    const query = joinPathWithRest(path, rest)
    const facets = `${query}?map=${map}`
    const from = (page - 1) * this.state.maxItemsPerPage
    const to = from + this.state.maxItemsPerPage - 1

    const contextProps = {
      ...this.props,
      path,
      map,
      rest,
      page,
      orderBy,
      pagesPath: nextTreePath,
    }

    return (
      <Query query={facetsQuery} variables={{ facets }}>
        {facetsQueryProps => (
          <Query
            query={searchQuery}
            variables={{ query, map, orderBy, from, to }}
            notifyOnNetworkStatusChange>
            {searchQueryProps => (
              <SearchQueryContext.Provider
                value={{
                  state: {
                    ...this.state,
                    setContextVariables: variables =>
                      this.setState({
                        ...variables,
                        /* When the real data arrives, isn't loading anymore */
                        loading: false,
                      }),
                  },
                  ...contextProps,
                  searchQuery: {
                    ...searchQueryProps,
                    ...searchQueryProps.data,
                  },
                  facetsQuery: {
                    ...facetsQueryProps,
                    ...facetsQueryProps.data,
                  },
                  loading:
                    this.state.loading ||
                    searchQuery.loading ||
                    facetsQuery.loading,
                }}>
                {this.props.children}
              </SearchQueryContext.Provider>
            )}
          </Query>
        )}
      </Query>
    )
  }
}

export default SearchQueryContainer

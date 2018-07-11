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
    ...searchQueryPropTypes,
    /** Children to be rendered */
    children: PropTypes.node.isRequired,
  }

  render() {
    const {
      treePath,
      params,
      runtime,
      query: {
        order: orderBy = SortOptions[0].value,
        page: pageProps,
        map: mapProps,
        rest = '',
      },
    } = this.props

    const path = reversePagesPath(runtime, treePath, params)
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
      pagesPath: treePath,
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

import React, { Component } from 'react'
import { Query } from 'react-apollo'

import { searchContextPropTypes } from '../constants/propTypes'
import { SearchQueryContext } from '../constants/searchContext'
import SortOptions from '../constants/searchSortOptions'
import { createMap } from '../helpers/searchHelpers'
import searchQuery from '../queries/searchQuery.gql'

const DEFAULT_PAGE = 1
const DEFAULT_MAX_ITEMS_PER_PAGE = 1

class SearchQueryContainer extends Component {
  state = {
    maxItemsPerPage: DEFAULT_MAX_ITEMS_PER_PAGE,
    /* Will be loading by default. The container will wait until the real data arrives */
    loading: true,
  }

  static propTypes = searchContextPropTypes

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

    const map = mapProps || createMap(params, rest)
    const page = pageProps ? parseInt(pageProps) : DEFAULT_PAGE
    const from = (page - 1) * this.state.maxItemsPerPage
    const to = from + this.state.maxItemsPerPage - 1

    const contextProps = {
      ...this.props,
      map,
      rest,
      page,
      orderBy,
      pagesPath: nextTreePath,
    }

    return (
      <Query
        query={searchQuery}
        variables={{
          query: Object.values(params).join('/'),
          map,
          rest,
          orderBy,
          from,
          to,
        }}
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
                ...searchQueryProps.data.search,
              },
            }}>
            {this.props.children}
          </SearchQueryContext.Provider>
        )}
      </Query>
    )
  }
}

export default SearchQueryContainer

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { ExtensionPoint } from 'render'

import { facetsQueryShape, searchQueryShape } from './constants/propTypes'
import { createMap, joinPathWithRest, reversePagesPath } from './helpers/searchHelpers'
import facetsQuery from './queries/facetsQuery.gql'
import searchQuery from './queries/searchQuery.gql'

const DEFAULT_PAGE = 1

class SearchPage extends Component {
  static propTypes = {
    params: PropTypes.shape({
      /** Search's term, e.g: eletronics. */
      term: PropTypes.string.isRequired,
      /** Department param. */
      department: PropTypes.string,
      /** Category param. */
      category: PropTypes.string,
      /** Subcategory param. */
      subcategory: PropTypes.string,
    }),
    query: PropTypes.shape({
      /**
       * Rest of the search term, e.g: eletronics/smartphones/samsung implies that
       * rest will be equal to "smartphones,samsung".
       * */
      rest: PropTypes.string,
      /** Determines the types of the terms, e.g: "c,c,b" (category, category, brand). */
      map: PropTypes.string,
      /** Search's pagination.  */
      page: PropTypes.string,
      /** Search's ordenation. */
      order: PropTypes.string,
    }),
    /** Internal route path. e.g: 'store/search' */
    treePath: PropTypes.string,
    /** Facets graphql query. */
    facetsQuery: facetsQueryShape,
    /** Search graphql query. */
    searchQuery: searchQueryShape,
  }

  render() {
    const {
      treePath,
      query: { order: orderBy, page: pageProps, map: mapProps, rest },
    } = this.props
    const pathName = reversePagesPath(treePath, this.props.params)
    const map = mapProps || createMap(pathName, rest)
    const page = pageProps ? parseInt(pageProps) : DEFAULT_PAGE
    const containerProps = {
      ...this.props,
      path: pathName,
      map,
      rest,
      page,
      orderBy,
      pagesPath: treePath,
    }
    return <ExtensionPoint id="container" {...containerProps} />
  }
}

compose(
  graphql(facetsQuery, {
    name: 'facetsQuery',
    options: props => {
      const { treePath, params, rest, map: mapProps } = props
      const path = reversePagesPath(treePath, params)
      const query = joinPathWithRest(path, rest)
      const facets = `${query}?map=${mapProps || createMap(path, rest)}`
      return {
        variables: { facets },
      }
    },
  }),
  graphql(searchQuery, {
    name: 'searchQuery',
    options: props => {
      const {
        treePath,
        rest,
        map,
        params,
        orderBy,
        page,
        maxItemsPerPage,
      } = props
      const path = reversePagesPath(treePath, params)
      const query = joinPathWithRest(path, rest)
      const from = (page - 1) * maxItemsPerPage
      const to = from + maxItemsPerPage - 1
      return {
        variables: { query, map, orderBy, from, to },
        notifyOnNetworkStatusChange: true,
      }
    },
  })
)(SearchPage)

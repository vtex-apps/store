import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Helmet, withRuntimeContext } from 'render'

import { SORT_OPTIONS, createMap, canonicalPathFromParams } from './utils/search'
import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'
import searchQuery from './queries/searchQuery.gql'

const DEFAULT_PAGE = 1
const DEFAULT_MAX_ITEMS_PER_PAGE = 1

class ProductSearchContextProvider extends Component {
  static propTypes = {
    params: PropTypes.shape({
      category: PropTypes.string,
      department: PropTypes.string,
      term: PropTypes.string,
    }),
    children: PropTypes.node.isRequired,
    runtime: PropTypes.shape({
      page: PropTypes.string.isRequired,
    }),
    query: PropTypes.shape({
      map: PropTypes.string,
      rest: PropTypes.string,
      order: PropTypes.oneOf(SORT_OPTIONS.map(o => o.value)),
      priceRange: PropTypes.string,
    }),
    nextTreePath: PropTypes.string,
  }

  state = {
    variables: {
      maxItemsPerPage: DEFAULT_MAX_ITEMS_PER_PAGE,
    },
    /* Will be loading by default. The container will wait until the real data arrives */
    loading: true,
  }

  pageCategory = products => {
    if (!products || products.length === 0) {
      return 'EmptySearch'
    }
    const { category, term } = this.props.params
    return term ? 'InternalSiteSearch' : category ? 'Category' : 'Department'
  }

  getPageEventName = products => {
    if (!products || products.length === 0) {
      return 'otherView'
    }
    const pageCategory = this.pageCategory(products)
    return `${pageCategory.charAt(0).toLowerCase()}${pageCategory.slice(1)}View`
  }

  getData = searchQuery => {
    if (!searchQuery) {
      return null
    }

    const { products, titleTag } = searchQuery
    const { department, category } = this.props.params
    return [
      {
        ecommerce: {
          impressions:
            Array.isArray(products) &&
            products.map((product, index) => ({
              id: product.productId,
              name: product.productName,
              list: 'Search Results',
              brand: product.brand,
              category: searchQuery.facets.CategoriesTrees[index]
                ? searchQuery.facets.CategoriesTrees[index].Name
                : category,
              position: `${index + 1}`,
              price: product
                ? `${product.items[0].sellers[0].commertialOffer.Price}`
                : '',
            })),
        },
      },
      {
        accountName: global.__RUNTIME__.account,
        pageCategory: this.pageCategory(products),
        pageDepartment: department,
        pageFacets: [],
        pageTitle: titleTag,
        pageUrl: window.location.href,
      },
      {
        event: this.getPageEventName(products),
      },
    ]
  }

  handleContextVariables = variables => {
    this.setState({
      variables,
      loading: false,
    })
  }

  render() {
    const {
      nextTreePath,
      params,
      query: {
        order: orderBy = SORT_OPTIONS[0].value,
        page: pageProps,
        map: mapProps,
        rest = '',
        priceRange,
      },
      runtime: { page: runtimePage },
    } = this.props

    const { variables: { maxItemsPerPage } } = this.state

    const map = mapProps || createMap(params, rest)
    const page = pageProps ? parseInt(pageProps) : DEFAULT_PAGE
    const from = (page - 1) * maxItemsPerPage
    const to = from + maxItemsPerPage - 1

    return (
      <Query
        query={searchQuery}
        variables={{
          query: Object.values(params)
            .filter(s => s.length > 0)
            .join('/'),
          map,
          rest,
          orderBy,
          priceRange,
          from,
          to,
        }}
        notifyOnNetworkStatusChange
      >
        {searchQueryProps => {
          const { data, loading } = searchQueryProps
          const { search } = data || {}
          const { titleTag, metaTagDescription } = search || {}
          return (
            <DataLayerApolloWrapper
              getData={() =>
                this.getData({
                  ...search,
                })
              }
              loading={this.state.loading || loading}
            >
              <Helmet>
                {params && (
                  <link
                    rel="canonical"
                    href={canonicalPathFromParams(params)}
                  />
                )}
                {titleTag && <title>{titleTag}</title>}
                {metaTagDescription && (
                  <meta name="description" content={metaTagDescription} />
                )}
              </Helmet>
              {React.cloneElement(this.props.children, {
                ...this.props,
                searchQuery: {
                  ...searchQueryProps,
                  ...search,
                },
                loading: this.state.loading,
                setContextVariables: this.handleContextVariables,
                searchContext: runtimePage,
                pagesPath: nextTreePath,
                map,
                rest,
                orderBy,
                priceRange,
                page,
                from,
                to,
              })}
            </DataLayerApolloWrapper>
          )
        }}
      </Query>
    )
  }
}

export default withRuntimeContext(ProductSearchContextProvider)

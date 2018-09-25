import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Helmet, withRuntimeContext } from 'render'

import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'
import searchQuery from './queries/searchQuery.gql'
import {
  canonicalPathFromParams,
  createMap,
  SORT_OPTIONS,
} from './utils/search'

const DEFAULT_PAGE = 1
const DEFAULT_MAX_ITEMS_PER_PAGE = 10

class ProductSearchContextProvider extends Component {
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
    /** Current extension point name */
    nextTreePath: PropTypes.string,
    /** Component to be rendered */
    children: PropTypes.node.isRequired,
  }

  componentDidMount() {
    const { prefetchPage } = this.props.runtime
    prefetchPage('store/home')
    prefetchPage('store/product')
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
    },
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
    const { account } = this.props.runtime
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
        accountName: account,
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

  render() {
    const {
      nextTreePath,
      params,
      maxItemsPerPage,
      query: {
        order: orderBy = SORT_OPTIONS[0].value,
        page: pageProps,
        map: mapProps,
        rest = '',
        priceRange,
      },
      runtime: { page: runtimePage },
    } = this.props

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
              loading={loading}
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

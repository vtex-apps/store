import React, { Component } from 'react'
import { path } from 'ramda'

import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'
import SearchQueryContainer from './components/SearchQueryContainer'
import { searchContextPropTypes } from './constants/propTypes'
import { SearchQueryContext } from './constants/searchContext'

class ProductSearchContextProvider extends Component {
  static propTypes = searchContextPropTypes

  getData = () => {
    const { searchQuery } = this.props

    if (!searchQuery) {
      return null
    }

    const { products } = searchQuery

    return {
      ecommerce: {
        impressions: products.map((product, index) => ({
          id: product.productId,
          name: product.productName,
          list: 'Search Results',
          brand: product.brand,
          category: path(['categories', '0'], product),
          position: index + 1,
        })),
      },
    }
  }

  render() {
    const props = {
      ...this.props,
      // todo: this logic should be in SearchQueryContainer
      ...(this.props.params.brand && {
        query: {
          ...this.props.query,
          map: this.props.map || 'b',
        },
      }),
    }

    return (
      <SearchQueryContainer {...props}>
        <SearchQueryContext.Consumer>
          {contextProps => (
            <DataLayerApolloWrapper
              getData={this.getData}
              loading={
                contextProps.state.loading || contextProps.searchQuery.loading
              }
            >
              {React.cloneElement(this.props.children, contextProps)}
            </DataLayerApolloWrapper>
          )}
        </SearchQueryContext.Consumer>
      </SearchQueryContainer>
    )
  }
}

export default ProductSearchContextProvider

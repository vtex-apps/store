import PropTypes from 'prop-types'
import React, { Component } from 'react'

import ProductSearchDataLayer from './components/ProductSearchDataLayer'
import SearchQueryContainer from './components/SearchQueryContainer'
import { searchQueryPropTypes } from './constants/propTypes'
import { SearchQueryContext } from './constants/searchContext'

class ProductSearchContextProvider extends Component {
  static propTypes = {
    params: PropTypes.shape({
      /** Brand name */
      brand: PropTypes.string,

      /** handles /:department/d
       *  or /:department/:category
       *  or /:department/:category/:subcategory */
      department: PropTypes.string,
      category: PropTypes.string,
      subcategory: PropTypes.string,

      /** Search's term, e.g: eletronics. */
      term: PropTypes.string,
    }),
    ...searchQueryPropTypes,
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
            <ProductSearchDataLayer
              searchQuery={contextProps.searchQuery}
              loading={
                contextProps.state.loading || contextProps.searchQuery.loading
              }>
              {React.cloneElement(this.props.children, contextProps)}
            </ProductSearchDataLayer>
          )}
        </SearchQueryContext.Consumer>
      </SearchQueryContainer>
    )
  }
}

export default ProductSearchContextProvider

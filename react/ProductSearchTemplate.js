import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ExtensionPoint } from 'render'

import SearchQueryContainer from './components/SearchQueryContainer'
import { searchQueryPropTypes } from './constants/propTypes'
import { SearchQueryContext } from './constants/searchContext'

export default class SearchPage extends Component {
  static contextTypes = {
    prefetchPage: PropTypes.func,
  }

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

  componentDidMount() {
    this.context.prefetchPage('store/home')
  }

  render() {
    const props = {
      ...this.props,
      // todo: this logic should be in SearchQueryContainer
      ...this.props.params.brand && {
        query: {
          ...this.props.query,
          map: this.props.map || 'b',
        }
      }
    }

    return (
      <SearchQueryContainer {...props}>
        <SearchQueryContext.Consumer>
          {contextProps => <ExtensionPoint id="container" {...contextProps} />}
        </SearchQueryContext.Consumer>
      </SearchQueryContainer>
    )
  }
}

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ExtensionPoint } from 'render'

import SearchQueryContainer from './components/SearchQueryContainer'
import { searchQueryPropTypes } from './constants/propTypes'
import { SearchQueryContext } from './constants/searchContext'

export default class BrandPage extends Component {
  static propTypes = {
    params: PropTypes.shape({
      /** Brand name */
      brand: PropTypes.string.isRequired,
    }),
    ...searchQueryPropTypes,
  }

  static contextTypes = {
    prefetchPage: PropTypes.func,
  }

  componentDidMount() {
    this.context.prefetchPage('store/home')
  }

  render() {
    return (
      <SearchQueryContainer {...this.props}>
        <SearchQueryContext.Consumer>
          {contextProps => <ExtensionPoint id="container" {...contextProps} />}
        </SearchQueryContext.Consumer>
      </SearchQueryContainer>
    )
  }
}

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ExtensionPoint } from 'render'

import SearchQueryContainer from './components/SearchQueryContainer'
import { searchQueryPropTypes } from './constants/propTypes'
import { SearchQueryContext } from './constants/searchContext'

export default class DepartmentPage extends Component {
  static contextTypes = {
    prefetchPage: PropTypes.func,
  }

  static propTypes = {
    /** Query params */
    params: PropTypes.shape({
      /** Department param */
      department: PropTypes.string.isRequired,
    }),
    ...searchQueryPropTypes,
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

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ExtensionPoint } from 'render'

import SearchQueryContainer from './components/SearchQueryContainer'
import { searchQueryPropTypes } from './constants/propTypes'
import { SearchQueryContext } from './constants/searchContext'

export default class SearchPage extends Component {
  static propTypes = {
    params: PropTypes.shape({
      /** Search's term, e.g: eletronics. */
      term: PropTypes.string.isRequired,
    }),
    ...searchQueryPropTypes,
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

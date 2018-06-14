import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ExtensionPoint } from 'render'

export default class SearchPage extends Component {
  static propTypes = {
    params: PropTypes.shape({
      /** Search's term, e.g: eletronics. */
      term: PropTypes.string.isRequired,
    }),
    query: PropTypes.shape({
      /**
       * Rest of the search term, e.g: eletronics/smartphones/samsung implies that
       * Q will be equal to "smartphones,samsung".
       * */
      rest: PropTypes.string,
      /** Determines the types of the terms, e.g: "c,c,b" (category, category, brand). */
      map: PropTypes.string,
      /** Search's pagination.  */
      page: PropTypes.string,
      /** Search's ordenation. */
      order: PropTypes.string,
    }),
  }

  render() {
    return (
      <ExtensionPoint id="container" {...this.props} />
    )
  }
}

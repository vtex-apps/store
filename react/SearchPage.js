import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ExtensionPoint } from 'render'

export default class SearchPage extends Component {
  static propTypes = {
    params: PropTypes.shape({
      term: PropTypes.string.isRequired,
    }),
  }

  render() {
    return (
      <ExtensionPoint id="container" />
    )
  }
}

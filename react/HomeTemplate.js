import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ExtensionPoint } from 'render'

export default class HomePage extends Component {
  static contextTypes = {
    prefetchPage: PropTypes.func,
  }

  componentDidMount() {
    this.context.prefetchPage('store/product')
    this.context.prefetchPage('store/search')
  }

  render() {
    return (
      <ExtensionPoint id="container" />
    )
  }
}

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ExtensionPoint } from 'render'

export default class CategoryPage extends Component {
  static contextTypes = {
    prefetchPage: PropTypes.func,
  }

  static propTypes = {
    params: PropTypes.shape({
      department: PropTypes.string.isRequired,
      category: PropTypes.string,
      subcategory: PropTypes.string,
    }),
  }

  componentDidMount() {
    this.context.prefetchPage('store/home')
  }

  render() {
    return (
      <ExtensionPoint id="container" {...this.props} />
    )
  }
}

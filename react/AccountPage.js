import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { ExtensionPoint } from 'render'

export default class AccountPage extends Component {
  static contextTypes = {
    prefetchPage: PropTypes.func,
  }

  static propTypes = {
    children: PropTypes.element,
  }

  componentDidMount() {
    this.context.prefetchPage('store/home')
  }

  render() {
    return (
      <Fragment>
        <ExtensionPoint id="container" />
        <div className="vtex-account__template">{this.props.children}</div>
      </Fragment>
    )
  }
}
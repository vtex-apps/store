import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { ExtensionPoint } from 'render'

export default class StoreTemplate extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  render() {
    return (
      <Fragment>
        <ExtensionPoint id="theme" />
        <ExtensionPoint id="header" />
        <div className="vtex-store__template">{this.props.children}</div>
        <ExtensionPoint id="footer" />
      </Fragment>
    )
  }
}

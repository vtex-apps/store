import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { ExtensionPoint } from 'render'

import './store.global.css'

export default class StoreTemplate extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  render() {
    return (
      <Fragment>
        <ExtensionPoint id="header" />
        <div className="vtex-store__template w-100 h-100">{this.props.children}</div>
        <ExtensionPoint id="footer" />
      </Fragment>
    )
  }
}

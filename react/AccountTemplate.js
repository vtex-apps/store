import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { ExtensionPoint } from 'render'

export default class AccountPage extends Component {
  static propTypes = {
    children: PropTypes.element,
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

import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { ExtensionPoint } from 'render'

export default class AccountPage extends Component {
  static contextTypes = {
    prefetch: PropTypes.func,
  }

  componentDidMount() {
    this.context.prefetch('store/home')
  }

  render() {
    return (
      <Fragment>
        <ExtensionPoint id="profile" />
        <ExtensionPoint id="orders" />
      </Fragment>
    )
  }
}

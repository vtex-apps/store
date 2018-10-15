import React, { Component } from 'react'
import { Helmet } from 'render'

import { gtmScript, gtmFrame } from '../scripts/gtm'

export default class GtmScripts extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    const { gtmId } = this.props

    const scripts = gtmId ? [{
      'type': 'application/javascript',
      'innerHTML': gtmScript(gtmId),
    }] : []
    const noscripts = gtmId ? [{ id: 'gtm_frame', innerHTML: gtmFrame(gtmId) }] : []

    return (
      <Helmet script={scripts} noscript={noscripts} />
    )
  }
}

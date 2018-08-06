import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'render'

import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'

const APP_LOCATOR = 'vtex.store'
const CONTENT_TYPE = 'text/html;charset=utf-8'
const META_ROBOTS = 'index, follow'

export default class HomeContextProvider extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  getData = () => ({
    accountName: global.__RUNTIME__.account,
    pageTitle: document.title,
    pageUrl: location.href,
    pageCategory: 'Home'
  })

  render() {
    const settings = this.context.getSettings(APP_LOCATOR) || {}
    const {
      titleTag,
      metaTagDescription,
    } = settings
    return (
      <DataLayerApolloWrapper loading={false} getData={this.getData}>
        <Helmet>
          <title>{titleTag}</title>
          <meta name="description" content={metaTagDescription} />
        </Helmet>
        {this.props.children}
      </DataLayerApolloWrapper>
    )
  }
}

HomeContextProvider.contextTypes = {
  getSettings: PropTypes.func,
}
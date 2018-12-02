import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRuntimeContext } from 'render'

import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'

class HomeWrapper extends Component {
  static propTypes = {
    children: PropTypes.element,
    runtime: PropTypes.shape({
      account: PropTypes.string,
    }),
  }

  getData = () => ({
    event: 'pageInfo',
    eventType: 'homeView',
    accountName: this.props.runtime.account,
    pageTitle: document.title,
    pageUrl: location.href,
    pageCategory: 'Home',
  })

  render() {
    return (
      <DataLayerApolloWrapper loading={false} getData={this.getData}>
        {this.props.children}
      </DataLayerApolloWrapper>
    )
  }
}

export default withRuntimeContext(HomeWrapper)

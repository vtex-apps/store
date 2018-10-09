import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRuntimeContext } from 'render'

import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'

class HomeContextProvider extends Component {
  static propTypes = {
    children: PropTypes.element,
    runtime: PropTypes.shape({
      account: PropTypes.string,
      prefetchPage: PropTypes.func,
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

  componentDidMount() {
    const { prefetchPage } = this.props.runtime
    prefetchPage('store/product')
    prefetchPage('store/search')
  }

  render() {
    return (
      <DataLayerApolloWrapper loading={false} getData={this.getData}>
        {this.props.children}
      </DataLayerApolloWrapper>
    )
  }
}

export default withRuntimeContext(HomeContextProvider)

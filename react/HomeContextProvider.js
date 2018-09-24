import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'
import withPrefetch from './components/withPrefetch';

class HomeContextProvider extends Component {
  static propTypes = {
    children: PropTypes.element,
    prefetch: PropTypes.func,
  }

  getData = () => ({
    accountName: global.__RUNTIME__.account,
    pageTitle: document.title,
    pageUrl: location.href,
    pageCategory: 'Home',
  }, {
      event: 'homeView'
    })

  componentDidMount() {
    this.props.prefetch('store/product')
    this.props.prefetch('store/search')
  }

  render() {
    return (
      <DataLayerApolloWrapper loading={false} getData={this.getData}>
        {this.props.children}
      </DataLayerApolloWrapper>
    )
  }
}

export default withPrefetch(HomeContextProvider)
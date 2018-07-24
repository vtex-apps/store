import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { searchQueryShape } from '../constants/propTypes'
import { getProductImpression } from '../helpers/dataLayerHelper'
import DataLayerWrapper from './DataLayerWrapper'
import withDataLayer, { dataLayerProps } from './withDataLayer'

class ProductSearchDataLayer extends Component {
  static propTypes = {
    /** Search graphql query. */
    searchQuery: searchQueryShape,
    /** Children nodes */
    children: PropTypes.node.isRequired,
    ...dataLayerProps,
  }

  formatToDataLayer = products => ({
    ecommerce: {
      impressions: products.map((product, index) =>
        getProductImpression(product, { position: index + 1 })
      ),
    },
  })

  render() {
    return (
      <DataLayerWrapper
        data={this.props.searchQuery.products}
        loading={this.props.searchQuery.loading}
        formatToDataLayer={this.formatToDataLayer}>
        {this.props.children}
      </DataLayerWrapper>
    )
  }
}

export default withDataLayer(ProductSearchDataLayer)

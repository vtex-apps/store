import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { getProductDetail } from '../helpers/dataLayerHelper'
import DataLayerWrapper from './DataLayerWrapper'
import withDataLayer, { dataLayerProps } from './withDataLayer'

class ProductDataLayer extends Component {
  static propTypes = {
    /** Product graphql query. */
    data: PropTypes.object.isRequired,
    /** Children nodes */
    children: PropTypes.node.isRequired,
    ...dataLayerProps,
  }

  formatToDataLayer = product => ({
    ecommerce: {
      detail: {
        products: [getProductDetail(product)],
      },
    },
  })

  render() {
    return (
      <DataLayerWrapper
        data={this.props.data.product}
        loading={this.props.data.loading}
        formatToDataLayer={this.formatToDataLayer}>
        {this.props.children}
      </DataLayerWrapper>
    )
  }
}

export default withDataLayer(ProductDataLayer)

import PropTypes from 'prop-types'
import { Component } from 'react'

import { searchQueryShape } from '../constants/propTypes'
import { getProductImpression } from '../helpers/dataLayerHelper'
import withDataLayer, { dataLayerProps } from './withDataLayer'

class ProductSearchDataLayer extends Component {
  static propTypes = {
    /** Search graphql query. */
    searchQuery: searchQueryShape,
    /** Children nodes */
    children: PropTypes.node.isRequired,
    ...dataLayerProps,
  }

  pushToDataLayer = products => {
    this.props.pushToDataLayer({
      ecommerce: {
        impressions: products.map((product, index) =>
          getProductImpression(product, { position: index + 1 })
        ),
      },
    })
  }

  componentDidMount() {
    if (!this.props.loading) {
      this.pushToDataLayer(this.props.searchQuery.products)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading && !this.props.loading) {
      this.pushToDataLayer(this.props.searchQuery.products)
    }
  }

  render() {
    return this.props.children
  }
}

export default withDataLayer(ProductSearchDataLayer)

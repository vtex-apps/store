import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { ExtensionPoint } from 'render'

import withDataLayer, { dataLayerProps } from './components/withDataLayer'
import productQuery from './queries/productQuery.gql'

class ProductPage extends Component {
  static contextTypes = {
    prefetchPage: PropTypes.func,
  }

  static propTypes = {
    params: PropTypes.object,
    data: PropTypes.object,
    ...dataLayerProps,
  }

  pushToDataLayer = product => {
    this.props.pushToDataLayer({
      event: 'productDetail',
      ecommerce: {
        detail: {
          products: [{
            name: product.productName,
            brand: product.brand,
          }],
        },
      },
    })
  }

  componentDidMount() {
    this.context.prefetchPage('store/home')

    if (!this.props.data.loading) {
      this.pushToDataLayer(this.props.data.product)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data.loading && !this.props.data.loading) {
      this.pushToDataLayer(this.props.data.product)
    }
  }

  render() {
    const { data } = this.props
    const { loading, variables, product } = data

    return (
      <div className="vtex-product-details-container">
        {!loading && (
          <ExtensionPoint
            id="container"
            slug={variables.slug}
            categories={product.categories}
            product={product}
          />
        )}
      </div>
    )
  }
}

const options = {
  options: props => ({
    variables: {
      slug: props.params.slug,
    },
  }),
}

export default compose(
  graphql(productQuery, options),
  withDataLayer
)(ProductPage)

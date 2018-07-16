import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { ExtensionPoint } from 'render'
import MicroData from './components/MicroData'

import withDataLayer, { dataLayerProps } from './components/withDataLayer'
import productQuery from './queries/productQuery.gql'

class ProductPage extends Component {
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
          products: [
            {
              name: product.productName,
              brand: product.brand,
              category:
                product.categories.length > 0
                  ? product.categories[0]
                  : undefined,
              id: product.productId,
            },
          ],
        },
      },
    })
  }

  componentDidMount() {
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
    const { loading, variables, product } = this.props.data

    return (
      <div className="vtex-product-details-container">
        <Fragment>
          {!loading && <MicroData product={product} />}
          <ExtensionPoint
            id="container"
            slug={variables.slug}
            categories={loading ? [] : product.categories}
            productQuery={this.props.data}
          />
        </Fragment>
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

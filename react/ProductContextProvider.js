import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { withApollo, graphql, compose } from 'react-apollo'
import { path } from 'ramda'

import MicroData from './components/MicroData'
import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'
import productQuery from './queries/productQuery.gql'
import productPreviewFragment from './queries/productPreview.gql'
import { cacheLocator } from './cacheLocator'

class ProductContextProvider extends Component {
  static propTypes = {
    params: PropTypes.object,
    data: PropTypes.object,
    children: PropTypes.node,
  }

  getData = () => {
    const { data: { product } } = this.props

    return {
      ecommerce: {
        detail: {
          products: [
            {
              id: product.productId,
              name: product.productName,
              brand: product.brand,
              category: path(['categories', '0'], product),
            },
          ],
        },
      },
    }
  }

  render() {
    const {
      data,
      params: { slug },
      client, // eslint-disable-line react/prop-types
    } = this.props
    const { loading } = data
    const productPreview = client.readFragment({
      id: cacheLocator.product(slug),
      fragment: productPreviewFragment,
    })
    const product = loading ? productPreview : data.product
    const categories = product && product.categories

    const productQuery = {
      categories,
      loading,
      product,
    }

    return (
      <div className="vtex-product-details-container">
        <Fragment>
          {product && <MicroData product={product} />}
          <DataLayerApolloWrapper
            getData={this.getData}
            loading={this.props.data.loading}
          >
            {React.cloneElement(this.props.children, {
              productQuery,
              slug,
            })}
          </DataLayerApolloWrapper>
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
  withApollo,
  graphql(productQuery, options)
)(ProductContextProvider)

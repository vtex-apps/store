import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import MicroData from './components/MicroData'

import withDataLayer, { dataLayerProps } from './components/withDataLayer'
import productQuery from './queries/productQuery.gql'

class ProductContextProvider extends Component {
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
    const {
      data,
      params: { slug },
    } = this.props
    const { loading, product } = data
    const { categories } = product || {}

    const productQuery = {
      product,
      loading,
    }

    return (
      <div className="vtex-product-details-container">
        <Fragment>
          {!loading && <MicroData product={product} />}
          {React.cloneElement(this.props.children, {
            productQuery,
            categories,
            slug,
          })}
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
)(ProductContextProvider)

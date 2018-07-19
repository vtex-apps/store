import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'

import MicroData from './components/MicroData'
import ProductDataLayer from './components/ProductDataLayer'
import productQuery from './queries/productQuery.gql'

class ProductContextProvider extends Component {
  static propTypes = {
    params: PropTypes.object,
    data: PropTypes.object,
    children: PropTypes.node,
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
          <ProductDataLayer data={this.props.data}>
            {React.cloneElement(this.props.children, {
              productQuery,
              categories,
              slug,
            })}
          </ProductDataLayer>
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

export default compose(graphql(productQuery, options))(ProductContextProvider)

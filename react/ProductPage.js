import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { ExtensionPoint } from 'render'
import MicroData from './components/MicroData'
import productQuery from './queries/productQuery.gql'

class ProductPage extends Component {
  static contextTypes = {
    prefetchPage: PropTypes.func,
  }
  static propTypes = {
    params: PropTypes.object,
    data: PropTypes.object,
  }

  componentDidMount() {
    this.context.prefetchPage('store/home')
  }

  render() {
    const { data } = this.props
    const { loading, variables, product } = data

    return (
      <div>
        <div className="vtex-product-details-container">
          {!loading && (
            <Fragment>
              <MicroData product={product} />
              <ExtensionPoint
                id="container"
                slug={variables.slug}
                categories={product.categories}
                product={product}
              />
            </Fragment>
          )}
        </div>
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

export default graphql(productQuery, options)(
  ProductPage
)

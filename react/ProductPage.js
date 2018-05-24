import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { ExtensionPoint } from 'render'

import productQuery from './queries/productQuery.gql'

import WrappedSpinner from './components/WrappedSpinner'

class ProductPage extends Component {
  static contextTypes = {
    prefetch: PropTypes.func,
  }

  static propTypes = {
    params: PropTypes.object,
    data: PropTypes.object,
  }

  componentDidMount() {
    this.context.prefetch('store/home')
  }

  render() {
    const { data } = this.props
    const { loading, variables } = data
    return (
      <div>
        {loading ? (
          <WrappedSpinner />
        ) : (
          <div>
            <div className="vtex-product-details-container">
              <ExtensionPoint id="container" slug={variables.slug} />
            </div>
          </div>
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

export default graphql(productQuery, options)(
  ProductPage
)

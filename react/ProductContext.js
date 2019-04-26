import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withApollo, graphql, compose } from 'react-apollo'
import { isEmpty } from 'ramda'
import { withRuntimeContext } from 'vtex.render-runtime'

import {
  product,
  productPreviewFragment,
  recommendationsAndBenefits,
} from 'vtex.store-resources/Queries'

import { cacheLocator } from './cacheLocator'

class ProductContext extends Component {
  static propTypes = {
    params: PropTypes.object,
    query: PropTypes.shape({
      skuId: PropTypes.string,
    }),
    data: PropTypes.object,
    children: PropTypes.node,
    runtime: PropTypes.object,
    client: PropTypes.object,
    catalog: PropTypes.object,
    recommendationsAndBenefits: PropTypes.object,
  }

  get product() {
    const {
      catalog: { product: catalogProduct, loading: catalogLoading = true } = {},
      recommendationsAndBenefits: {
        product: recAndBenefitsProduct,
        loading: recAndBenefitsLoading = true,
      } = {},
    } = this.props

    const catalogInfo = !catalogLoading && catalogProduct
    const recAndBenefitsInfo =
      catalogInfo && !recAndBenefitsLoading && recAndBenefitsProduct
    const product = {
      ...catalogInfo,
      ...recAndBenefitsInfo,
    }
    return isEmpty(product) ? null : product
  }

  get loading() {
    const {
      catalog: { loading: catalogLoading = true } = {},
      recommendationsAndBenefits: {
        loading: recAndBenefitsLoading = true,
      } = {},
    } = this.props

    return catalogLoading || recAndBenefitsLoading
  }

  componentDidMount() {
    this.checkNotFoundProduct()
  }

  componentDidUpdate() {
    this.checkNotFoundProduct()
  }

  stripCategory(category) {
    return category && category.replace(/^\/|\/$/g, '')
  }

  checkNotFoundProduct = () => {
    const loading = this.loading
    const product = this.product
    const {
      params: { slug },
      runtime,
    } = this.props
    if (!product && !loading) {
      runtime.navigate({
        page: 'store.search',
        params: { term: slug },
        query: `productLinkNotFound=${slug}`,
      })
    }
  }

  render() {
    const {
      params,
      params: { slug },
      client,
      ...props
    } = this.props

    const productPreview = client.readFragment({
      id: cacheLocator.product(slug),
      fragment: productPreviewFragment,
    })
    const loadedProduct = this.product
    const product =
      loadedProduct ||
      (productPreview && productPreview.items ? productPreview : null)

    const loading = this.loading

    const productQuery = {
      loading,
      product,
    }

    // why do we still have this?
    if (!product && !loading) {
      productQuery.error = {
        message: 'Product not found!',
      }
    }

    /**
     * The breadcrumb component is being used in multiple pages,
     * therefore we need to adapt the data to its needs instead of
     * making the component do the changes itself.
     **/
    const breadcrumbsProps = {
      term: slug,
      categories: product ? product.categories : null,
    }

    return React.cloneElement(
      this.props.children,
      Object.assign(
        {},
        {
          productQuery,
          slug,
          params,
        },
        breadcrumbsProps,
        props
      )
    )
  }
}

const catalogOptions = {
  name: 'catalog',
  options: props => ({
    variables: {
      slug: props.params.slug,
    },
    errorPolicy: 'all',
  }),
}

const recommendationsAndBenefitsOptions = {
  name: 'recommendationsAndBenefits',
  options: props => ({
    variables: {
      slug: props.params.slug,
    },
    errorPolicy: 'all',
    ssr: false,
  }),
}

export default compose(
  withApollo,
  withRuntimeContext,
  graphql(product, catalogOptions),
  graphql(recommendationsAndBenefits, recommendationsAndBenefitsOptions)
)(ProductContext)

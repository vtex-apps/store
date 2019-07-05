import PropTypes from 'prop-types'
import React, { useEffect, useMemo } from 'react'
import { withApollo, graphql, compose } from 'react-apollo'
import { isEmpty } from 'ramda'
import { useRuntime } from 'vtex.render-runtime'

import {
  product,
  productPreviewFragment,
  productBenefits,
} from 'vtex.store-resources/Queries'

import { cacheLocator } from './cacheLocator'

function getProduct(props) {
  const {
    catalog: { product: catalogProduct, loading: catalogLoading = true } = {},
    productBenefits: {
      product: benefitsProduct,
      loading: benefitsLoading = true,
    } = {},
  } = props

  const catalogInfo = !catalogLoading && catalogProduct
  const benefitsInfo = catalogInfo && !benefitsLoading && benefitsProduct
  const product = {
    ...catalogInfo,
    ...benefitsInfo,
  }
  return isEmpty(product) ? null : product
}

function getLoading(props) {
  const {
    catalog: { loading: catalogLoading = true } = {},
    productBenefits: { loading: benefitsLoading = true } = {},
  } = props

  return catalogLoading || benefitsLoading
}

function useNotFound(loading, propsProduct, slug) {
  const { navigate } = useRuntime()

  useEffect(() => {
    if (!propsProduct && !loading) {
      navigate({
        page: 'store.search',
        params: { term: slug },
        query: `productLinkNotFound=${slug}`,
      })
    }
  }, [loading, propsProduct, navigate, slug])
}

const ProductContext = _props => {
  const {
    params,
    params: { slug },
    client,
    catalog: { refetch },
    ...props
  } = _props

  const loading = getLoading(_props)
  const propsProduct = getProduct(_props)

  useNotFound(loading, propsProduct, slug)

  const productPreview = client.readFragment({
    id: cacheLocator.product(slug),
    fragment: productPreviewFragment,
  })

  const product =
    propsProduct ||
    (productPreview && productPreview.items ? productPreview : null)

  /**
   * The breadcrumb component is being used in multiple pages,
   * therefore we need to adapt the data to its needs instead of
   * making the component do the changes itself.
   **/
  const breadcrumbsProps = useMemo(
    () => ({
      term: slug,
      categories: product ? product.categories : null,
      categoryTree: product ? product.categoryTree : null,
    }),
    [product, slug]
  )

  const childrenProps = useMemo(
    () => ({
      productQuery: {
        loading,
        product,
        refetch,
        error:
          !product && !loading
            ? {
                message: 'Product not found!',
              }
            : null,
      },
      slug,
      params,
      ...breadcrumbsProps,
      ...props,
    }),
    [props, breadcrumbsProps, loading, product, refetch, slug, params]
  )

  return React.cloneElement(props.children, childrenProps)
}

ProductContext.propTypes = {
  params: PropTypes.object,
  query: PropTypes.shape({
    skuId: PropTypes.string,
  }),
  data: PropTypes.object,
  children: PropTypes.node,
  client: PropTypes.object,
  catalog: PropTypes.object,
  productBenefits: PropTypes.object,
}

const catalogOptions = {
  name: 'catalog',
  options: props => ({
    variables: {
      slug: props.params.slug,
      identifier: {
        field: 'id',
        value: props.params.id || '',
      },
    },
    errorPolicy: 'all',
  }),
}

const productBenefitsOptions = {
  name: 'productBenefits',
  options: props => ({
    variables: {
      slug: props.params.slug,
      identifier: {
        field: 'id',
        value: props.params.id || '',
      },
    },
    errorPolicy: 'all',
    ssr: false,
  }),
}

export default compose(
  withApollo,
  graphql(product, catalogOptions),
  graphql(productBenefits, productBenefitsOptions)
)(ProductContext)

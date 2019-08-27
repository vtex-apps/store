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

const EMPTY_OBJECT = {}

const emptyOrNull = value => (value != null ? isEmpty(value) : true)

const useProduct = props => {
  const {
    catalog: { product: catalogProduct, loading: catalogLoading = true } = {},
    productBenefits: {
      product: benefitsProduct,
      loading: benefitsLoading = true,
    } = {},
  } = props

  const catalogInfo =
    !catalogLoading && catalogProduct ? catalogProduct : EMPTY_OBJECT
  const benefitsInfo =
    !benefitsLoading && benefitsProduct ? benefitsProduct : EMPTY_OBJECT

  return useMemo(() => {
    const bothEmpty = emptyOrNull(catalogInfo) && emptyOrNull(benefitsInfo)
    return bothEmpty ? null : { ...catalogInfo, ...benefitsInfo }
  }, [benefitsInfo, catalogInfo])
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
  const propsProduct = useProduct(_props)

  useNotFound(loading, propsProduct, slug)

  const productPreview = client.readFragment({
    id: cacheLocator.product(slug),
    fragment: productPreviewFragment,
  })

  const product =
    propsProduct ||
    (productPreview && productPreview.items ? productPreview : null)

  const productQuery = useMemo(
    () => ({
      loading,
      product,
      refetch,
      error:
        !product && !loading
          ? {
              message: 'Product not found!',
            }
          : null,
    }),
    [loading, product, refetch]
  )

  const childrenProps = useMemo(
    () => ({
      productQuery,
      slug,
      params,
    }),
    [productQuery, slug, params]
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

import PropTypes from 'prop-types'
import React, { useEffect, useMemo } from 'react'
import { withApollo, graphql, compose } from 'react-apollo'
import { isEmpty } from 'ramda'
import { useRuntime } from 'vtex.render-runtime'

import {
  product,
  productPreviewFragment,
  productBenefits,
  UNSTABLE__productCategoryTree as productCategoryTree,
} from 'vtex.store-resources/Queries'

import { cacheLocator } from './cacheLocator'

const EMPTY_OBJECT = {}

const emptyOrNull = value => (value != null ? isEmpty(value) : true)

const getInfoFromQuery = (queryObj = {}) => {
  const { product, loading = true } = queryObj
  return !loading && product ? product : EMPTY_OBJECT
}

const useProduct = ({ catalog, productBenefits, categoryTree }) => {
  const catalogInfo = getInfoFromQuery(catalog)
  const benefitsInfo = getInfoFromQuery(productBenefits)
  const categoryTeeInfo = getInfoFromQuery(categoryTree)

  return useMemo(() => {
    const allEmpty = [catalogInfo, benefitsInfo, categoryTeeInfo].every(
      emptyOrNull
    )
    return allEmpty
      ? null
      : { ...catalogInfo, ...benefitsInfo, ...categoryTeeInfo }
  }, [benefitsInfo, catalogInfo, categoryTeeInfo])
}

function getLoading(props) {
  const {
    catalog: { loading: catalogLoading = true } = {},
  } = props
  return catalogLoading
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
      skipCategoryTree: true,
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

const categoryTreeOptions = {
  name: 'categoryTree',
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
  graphql(productBenefits, productBenefitsOptions),
  graphql(productCategoryTree, categoryTreeOptions)
)(ProductContext)

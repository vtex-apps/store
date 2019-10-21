import PropTypes from 'prop-types'
import React, { useEffect, useMemo } from 'react'
import { withApollo, useQuery } from 'react-apollo'
import { isEmpty } from 'ramda'
import { useRuntime } from 'vtex.render-runtime'

import {
  product as productQuery,
  productPreviewFragment,
  productBenefits,
  UNSTABLE__productCategoryTree as productCategoryTree,
} from 'vtex.store-resources/Queries'

import { cacheLocator } from './cacheLocator'

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

const useProductQueries = params => {
  const {
    loading: catalogLoading,
    data: { product: catalogProduct } = {},
    refetch,
  } = useQuery(productQuery, {
    variables: {
      slug: params.slug,
      skipCategoryTree: true,
      identifier: {
        field: 'id',
        value: params.id || '',
      },
    },
    errorPolicy: 'all',
    displayName: 'ProductQuery',
  })

  const { data: { product: categoryTreeProduct } = {} } = useQuery(
    productCategoryTree,
    {
      variables: {
        slug: params.slug,
        identifier: {
          field: 'id',
          value: params.id || '',
        },
      },
      errorPolicy: 'all',
      ssr: false,
      displayName: 'ProductCategoryTreeQuery',
    }
  )

  const {
    loading: benefitsLoading,
    data: { product: benefitsProduct } = {},
  } = useQuery(productBenefits, {
    variables: {
      slug: params.slug,
      identifier: {
        field: 'id',
        value: params.id || '',
      },
    },
    errorPolicy: 'all',
    ssr: false,
    displayName: 'ProductBenefitsQuery',
  })

  const loading = catalogLoading || benefitsLoading
  const validProducts = [
    catalogProduct,
    categoryTreeProduct,
    benefitsProduct,
  ].filter(maybeProduct => maybeProduct && !isEmpty(maybeProduct))
  const allEmpty = validProducts.length === 0
  const product = allEmpty
    ? null
    : validProducts.reduce((acc, product) => ({ ...acc, ...product }), {})

  return {
    product,
    loading,
    refetch,
  }
}

const ProductContext = ({ params, params: { slug }, client, children }) => {
  const { loading, product: queryProduct, refetch } = useProductQueries(params)

  useNotFound(loading, queryProduct, slug)

  const productPreview = client.readFragment({
    id: cacheLocator.product(slug),
    fragment: productPreviewFragment,
  })

  const product =
    queryProduct ||
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

  return React.cloneElement(children, childrenProps)
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

export default withApollo(ProductContext)

import PropTypes from 'prop-types'
import React, { useEffect, useState, useMemo } from 'react'
import { withApollo, graphql, compose } from 'react-apollo'
import { isEmpty, path } from 'ramda'
import { useRuntime } from 'vtex.render-runtime'
import { ProductContext as ProductContextApp } from 'vtex.product-context'

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

function findAvailableProduct(item) {
  return item.sellers.find(
    ({ commertialOffer = {} }) => commertialOffer.AvailableQuantity > 0
  )
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

  const [selectedQuantity, setSelectedQuantity] = useState(1)

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

  const items = path(['items'], product) || []
  const selectedItem = props.query.skuId
    ? items.find(sku => sku.itemId === props.query.skuId)
    : items.find(findAvailableProduct) || items[0]

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
      breadcrumbsProps,
      props,
    }),
    [props, breadcrumbsProps, loading, product, refetch, slug, params]
  )

  const value = useMemo(
    () => ({
      product,
      categories: path(['categories'], product),
      selectedItem,
      onChangeQuantity: setSelectedQuantity,
      selectedQuantity: selectedQuantity,
    }),
    [product, selectedItem, setSelectedQuantity, selectedQuantity]
  )

  return (
    <ProductContextApp.Provider value={value}>
      {React.cloneElement(props.children, childrenProps)}
    </ProductContextApp.Provider>
  )
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
    },
    errorPolicy: 'all',
  }),
}

const productBenefitsOptions = {
  name: 'productBenefits',
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
  graphql(product, catalogOptions),
  graphql(productBenefits, productBenefitsOptions)
)(ProductContext)

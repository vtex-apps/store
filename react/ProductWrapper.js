import PropTypes from 'prop-types'
import React, { useMemo, Fragment } from 'react'
import { LoadingContextProvider } from 'vtex.render-runtime'
import { ProductOpenGraph } from 'vtex.open-graph'
import useProduct from './components/new/ProductContext/useProduct'
import ProductContextProvider from './components/new/ProductContext/ProductContextProvider'

import { Product as ProductStructuredData } from 'vtex.structured-data'
import WrapperContainer from './components/WrapperContainer'

import ProductTitleAndPixel from './components/ProductTitleAndPixel'

const Content = ({ loading, children, childrenProps }) => {
  const { product, selectedItem } = useProduct()
  return (
    <Fragment>
      <ProductTitleAndPixel
        product={product}
        selectedItem={selectedItem}
        loading={loading}
      />
      {product && <ProductOpenGraph />}
      {product && selectedItem && (
        <ProductStructuredData product={product} selectedItem={selectedItem} />
      )}
      {React.cloneElement(children, childrenProps)}
    </Fragment>
  )
}

const ProductWrapper = ({
  params: { slug },
  productQuery,
  productQuery: { product, loading } = {},
  query,
  children,
  ...props
}) => {
  const childrenProps = useMemo(
    () => ({
      productQuery,
      slug,
      ...props,
    }),
    [productQuery, slug, props]
  )

  const hasProductData = !!product

  const loadingValue = useMemo(
    () => ({
      isParentLoading: loading || !hasProductData,
    }),
    [loading, hasProductData]
  )

  return (
    <WrapperContainer className="vtex-product-context-provider">
      <ProductContextProvider query={query} product={product}>
        <Content loading={loading} childrenProps={childrenProps}>
          <LoadingContextProvider value={loadingValue}>
            {children}
          </LoadingContextProvider>
        </Content>
      </ProductContextProvider>
    </WrapperContainer>
  )
}

ProductWrapper.propTypes = {
  params: PropTypes.object,
  productQuery: PropTypes.object,
  children: PropTypes.node,
  /* URL query params */
  query: PropTypes.object,
}

export default ProductWrapper

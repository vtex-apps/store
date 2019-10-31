import PropTypes from 'prop-types'
import React, { useMemo, Fragment } from 'react'
import { LoadingContext } from 'vtex.render-runtime'
import { ProductOpenGraph } from 'vtex.open-graph'
import useProduct from 'vtex.product-context/useProduct'
import ProductContextProvider from 'vtex.product-context/ProductContextProvider'

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

  return (
    <WrapperContainer className="vtex-product-context-provider">
      <ProductContextProvider query={query} product={product}>
        <Content loading={loading} childrenProps={childrenProps}>
          <LoadingContext.Provider
            value={{ isParentLoading: loading || !product }}
          >
            {children}
          </LoadingContext.Provider>
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

import PropTypes from 'prop-types'
import React, { useMemo, Fragment } from 'react'
import {
  LoadingContextProvider,
  canUseDOM,
  useRuntime,
} from 'vtex.render-runtime'
import { ProductOpenGraph } from 'vtex.open-graph'
import { TwitterMetaTags } from 'vtex.twitter-meta-tags'
import useProduct from 'vtex.product-context/useProduct'
import ProductContextProvider from 'vtex.product-context/ProductContextProvider'
import { Product as ProductStructuredData } from 'vtex.structured-data'

import WrapperContainer from './components/WrapperContainer'
import ProductTitleAndPixel from './components/ProductTitleAndPixel'

const Content = ({ listName, loading, children, childrenProps }) => {
  const { product, selectedItem } = useProduct()
  return (
    <Fragment>
      <ProductTitleAndPixel
        listName={listName}
        product={product}
        selectedItem={selectedItem}
        loading={loading}
      />
      {product && <ProductOpenGraph />}

      {product && <TwitterMetaTags />}

      {product && selectedItem && (
        <ProductStructuredData product={product} selectedItem={selectedItem} />
      )}
      {React.cloneElement(children, childrenProps)}
    </Fragment>
  )
}

const ProductWrapper = ({
  params: { slug, __listName: listName },
  productQuery,
  productQuery: { product, loading } = {},
  query,
  CustomContext,
  children,
  ...props
}) => {
  const { getSettings } = useRuntime()
  const { enableFullSSROnProduct } = getSettings('vtex.store')
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

  const isSSRLoading =
    loadingValue.isParentLoading && enableFullSSROnProduct && !canUseDOM

  const CustomContextElement = CustomContext || Fragment

  return (
    <WrapperContainer className="vtex-product-context-provider">
      <ProductContextProvider query={query} product={product}>
        <Content
          listName={listName}
          loading={loading}
          childrenProps={childrenProps}
        >
          <LoadingContextProvider value={loadingValue}>
            <CustomContextElement>
              {isSSRLoading ? <Fragment /> : children}
            </CustomContextElement>
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
  CustomContext: PropTypes.any,
}

export default ProductWrapper

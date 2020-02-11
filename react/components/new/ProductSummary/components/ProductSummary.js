import React, { useCallback, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { pathOr, path } from 'ramda'
import { useInView } from 'react-intersection-observer'
import { Link } from 'vtex.render-runtime'
import { ProductListContext } from 'vtex.product-list-context'
import ProductSummaryContext from './ProductSummaryContext'
import {
  ProductSummaryProvider,
  useProductSummaryDispatch,
  useProductSummary,
} from 'vtex.product-summary-context/ProductSummaryContext'
import ProductContextProvider from '../../ProductContext/ProductContextProvider'
import { productShape } from '../utils/propTypes'
import { mapCatalogProductToProductSummary } from '../utils/normalize'
import useCssHandles from '../../CssHandles/useCssHandles'

const PRODUCT_SUMMARY_MAX_WIDTH = 300
const CSS_HANDLES = ['container', 'containerNormal', 'element', 'clearLink']

const ProductSummaryCustom = ({
  product,
  actionOnClick,
  children,
  containerRef,
}) => {
  const { isLoading, isHovering, selectedItem, query } = useProductSummary()
  const dispatch = useProductSummaryDispatch()
  const handles = useCssHandles(CSS_HANDLES)

  /*
    Use ProductListContext to send pixel events.
    Beware that productListDispatch could be undefined if
    this component is not wrapped by a <ProductListContextProvider/>.
    In that case we don't need to send events.
  */
  const { useProductListDispatch } = ProductListContext
  const productListDispatch = useProductListDispatch()
  const [inViewRef, inView] = useInView({
    // Triggers the event when the element is 75% visible
    threshold: 0.75,
    triggerOnce: true,
  })
  useEffect(() => {
    if (inView) {
      productListDispatch &&
        productListDispatch({
          type: 'SEND_IMPRESSION',
          args: { product: product },
        })
    }
  }, [productListDispatch, inView, product])

  useEffect(() => {
    if (product) {
      dispatch({
        type: 'SET_PRODUCT',
        args: { product },
      })
    }
  }, [product, dispatch])

  const handleMouseLeave = useCallback(() => {
    dispatch({
      type: 'SET_HOVER',
      args: { isHovering: false },
    })
  }, [dispatch])

  const handleMouseEnter = useCallback(() => {
    dispatch({
      type: 'SET_HOVER',
      args: { isHovering: true },
    })
  }, [dispatch])

  const handleItemsStateUpdate = useCallback(
    isLoading => {
      dispatch({
        type: 'SET_LOADING',
        args: { isLoading },
      })
    },
    [dispatch]
  )

  const oldContextProps = useMemo(
    () => ({
      product,
      isLoading,
      isHovering,
      handleItemsStateUpdate: handleItemsStateUpdate,
    }),
    [product, isLoading, isHovering, handleItemsStateUpdate]
  )

  const containerClasses = classNames(
    handles.container,
    handles.containerNormal,
    'overflow-hidden br3 h-100 w-100 flex flex-column justify-between center tc'
  )

  const summaryClasses = classNames(
    handles.element,
    'pointer pt3 pb4 flex flex-column h-100'
  )

  const linkClasses = classNames(handles.clearLink, 'h-100 flex flex-column')

  const skuId = pathOr(
    path(['sku', 'itemId'], product),
    ['itemId'],
    selectedItem
  )

  return (
    <ProductSummaryContext.Provider value={oldContextProps}>
      <ProductContextProvider product={product} query={{ skuId }}>
        <section
          className={containerClasses}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ maxWidth: PRODUCT_SUMMARY_MAX_WIDTH }}
          // If containerRef is passed, it should be used
          ref={containerRef || inViewRef}
        >
          <Link
            className={linkClasses}
            page="store.product"
            params={{
              slug: product && product.linkText,
              id: product && product.productId,
            }}
            query={query}
            onClick={actionOnClick}
          >
            <article className={summaryClasses}>{children}</article>
          </Link>
        </section>
      </ProductContextProvider>
    </ProductSummaryContext.Provider>
  )
}

ProductSummaryCustom.propTypes = {
  /** Product that owns the informations */
  product: productShape,
  /** Function that is executed when a product is clicked */
  actionOnClick: PropTypes.func,
  children: PropTypes.node,
  containerRef: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element
    PropTypes.shape({ current: PropTypes.instanceOf(PropTypes.Element) }),
  ]),
}

function ProductSummaryWrapper(props) {
  return (
    <ProductSummaryProvider {...props}>
      <ProductSummaryCustom {...props} />
    </ProductSummaryProvider>
  )
}

ProductSummaryWrapper.getSchema = () => {
  return {
    title: 'admin/editor.productSummary.title',
    description: 'admin/editor.productSummary.description',
  }
}

// This function is public available to be used only by vtex.shelf and vtex.search-result.
// We do not garantee this API will not change and might happen breaking change anytime.
ProductSummaryWrapper.mapCatalogProductToProductSummary = mapCatalogProductToProductSummary

export default ProductSummaryWrapper

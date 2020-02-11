import React, { useMemo, useCallback, useEffect } from 'react'
import { assocPath } from 'ramda'
import { useInView } from 'react-intersection-observer'
import { ProductListContext } from 'vtex.product-list-context'
// import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
// import { ExtensionPoint } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import ProductSummaryShelf from '../../ProductSummary/ProductSummaryCustom'
import ProductSummaryImage from '../../ProductSummary/ProductSummaryImage'
import ProductSummarySpecificationBadges from '../../ProductSummary/ProductSummarySpecificationBadges'
import ProductSummaryName from '../../ProductSummary/ProductSummaryName'
import ProductSummarySpacer from '../../ProductSummary/Spacer'
import ProductSummaryPrice from '../../ProductSummary/ProductSummaryPrice'
// import RatingInline from '../../ReviewsRatings/RatingInline'
import AddToCartBtn from '../../AddToCartButton/Wrapper'
import StackLayout from '../../StackLayout'

const { useProductListDispatch } = ProductListContext
/**
 * ShelfItem Component. Normalizes the item received in the props
 * to adapt to the extension point prop.
 */
const ShelfItem = ({ item, summary }) => {
  const { push } = usePixel()
  const newSummary = useMemo(() => assocPath(['name', 'tag'], 'h2', summary), [
    summary,
  ])
  const product = useMemo(
    () => ProductSummaryShelf.mapCatalogProductToProductSummary(item),
    [item]
  )

  const pushPixelProductClick = useCallback(() => {
    push({
      event: 'productClick',
      product: product,
    })
  }, [product, push])

  const [inViewRef, inView] = useInView({
    // Triggers the event when the element is 75% visible
    threshold: 0.75,
    triggerOnce: true,
  })

  const dispatch = useProductListDispatch()

  useEffect(() => {
    if (inView) {
      dispatch({ type: 'SEND_IMPRESSION', args: { product: product } })
    }
  }, [dispatch, inView, product])
  return (
    <ProductSummaryShelf containerRef={inViewRef} product={product} actionOnClick={pushPixelProductClick} {...newSummary}>
      <StackLayout>
        <ProductSummaryImage />
        <ProductSummarySpecificationBadges specificationGroupName="Group" specificationName="On Sale" visibleWhen="True" displayValue="SPECIFICATION_NAME" />
      </StackLayout>
      <ProductSummaryName />
      <ProductSummarySpacer />
      <ProductSummaryPrice />
      <AddToCartBtn />
    </ProductSummaryShelf>
  )

  // return (
  //   <ExtensionPoint
  //     id="product-summary"
  //     containerRef={inViewRef}
  //     product={product}
  //     actionOnClick={pushPixelProductClick}
  //     {...newSummary}
  //   />
  // )
}

export default ShelfItem

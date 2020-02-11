import React from 'react'
import { head } from 'ramda'
import SKUSelector from '../../../StoreComponents/SKUSelector'
import useCssHandles from '../../../CssHandles/useCssHandles'
import {
  useProductSummaryDispatch,
  useProductSummary,
} from 'vtex.product-summary-context/ProductSummaryContext'

const CSS_HANDLES = ['SKUSelectorContainer']

function ProductSummarySKUSelector(props) {
  const stopBubblingUp = e => {
    e.preventDefault()
    e.stopPropagation()
  }
  const dispatch = useProductSummaryDispatch()
  const { product } = useProductSummary()

  const handleSKUSelected = skuId => {
    const selectedItem =
      product.items && product.items.find(item => item.itemId === skuId)

    const sku = {
      ...selectedItem,
      image: head(selectedItem.images),
      seller: head(selectedItem.sellers),
    }

    const newProduct = {
      ...product,
      selectedItem,
      sku,
    }

    dispatch({
      type: 'SET_PRODUCT',
      args: { product: newProduct },
    })

    dispatch({
      type: 'SET_PRODUCT_QUERY',
      args: { query: `skuId=${skuId}` },
    })
  }

  const handles = useCssHandles(CSS_HANDLES)
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={stopBubblingUp}
      className={handles.SKUSelectorContainer}
    >
      <SKUSelector onSKUSelected={handleSKUSelected} {...props} />
    </div>
  )
}

export default ProductSummarySKUSelector

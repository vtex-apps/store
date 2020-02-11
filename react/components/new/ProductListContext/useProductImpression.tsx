import { useEffect, useCallback } from 'react'
import debounce from 'debounce'
import { PixelContext } from 'vtex.pixel-manager'

import productImpressionHooks, { Product, Dispatch } from './ProductListContext'
import { parseToProductImpression } from './utils/parser'

const { useProductListDispatch, useProductListState } = productImpressionHooks

const sendImpressionEvents = (
  products: Product[],
  push: any,
  dispatch: Dispatch
) => {
  if (!products || products.length <= 0) {
    return
  }
  const parsedProducts = products.filter(Boolean).map(parseToProductImpression)
  const impressions = parsedProducts.map((product: Product, index: number) => ({
    product,
    position: index + 1,
  }))
  push({
    event: 'productImpression',
    list: 'Shelf',
    impressions,
  })
  dispatch({ type: 'RESET_NEXT_IMPRESSIONS' })
}

const useProductImpression = () => {
  const { nextImpressions } = useProductListState()
  const { push } = PixelContext.usePixel()
  const dispatch = useProductListDispatch()

  const debouncedSendImpressionEvents = useCallback(
    debounce(sendImpressionEvents, 1000, false),
    []
  )

  useEffect(() => {
    debouncedSendImpressionEvents(nextImpressions, push, dispatch)
  }, [nextImpressions, debouncedSendImpressionEvents, dispatch, push])
}

export default useProductImpression

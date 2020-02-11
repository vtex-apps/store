import React, { FC } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { ExtensionPoint } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import useCssHandles from '../CssHandles/useCssHandles'

import { mapCartItemToPixel } from './modules/pixelHelper'

interface Props {
  renderAsChildren: boolean
}

const CSS_HANDLES = ['minicartProductListContainer'] as const

const ProductList: FC<Props> = ({ renderAsChildren }) => {
  const {
    orderForm: { items },
  } = useOrderForm()
  const { updateQuantity, removeItem } = useOrderItems()
  const { push } = usePixel()
  const handles = useCssHandles(CSS_HANDLES)

  const handleQuantityChange = (
    uniqueId: string,
    quantity: number,
    item: OrderFormItem
  ) => {
    const adjustedItem = {
      ...mapCartItemToPixel(item),
      quantity,
    }

    push({
      event: 'addToCart',
      items: [adjustedItem],
    })
    updateQuantity({ uniqueId, quantity })
  }
  const handleRemove = (uniqueId: string, item: OrderFormItem) => {
    const adjustedItem = mapCartItemToPixel(item)
    push({
      event: 'removeFromCart',
      items: [adjustedItem],
    })
    removeItem({ uniqueId })
  }

  return (
    <div
      /* 
        This prevents an interaction with the quantity selector
        inside of a product in the ProductList to bubble up a
        mouseleave event to the Popup component, which would result
        in the minicart being closed (when openOnHover = true). 
      */
      onMouseLeave={e => e.stopPropagation()}
      className={`${handles.minicartProductListContainer} ${
        renderAsChildren ? 'w-100 h-100' : ''
      } overflow-y-auto ph4 ph6-l`}
    >
      <ExtensionPoint
        id="product-list"
        items={items}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default ProductList

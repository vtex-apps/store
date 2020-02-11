import React, { memo } from 'react'
import { string, number, object, bool } from 'prop-types'
import ProductPrice from '../../../StoreComponents/ProductPrice'
import { reject } from 'ramda'

import useCssHandles from '../../../CssHandles/useCssHandles'
import AttachmentChildren from './AttachmentChildren'

const CSS_HANDLES = ['attachmentItemContainer', 'attachmentItem', 'attachmentItemProductText']

const itemShouldHide = ({ item, extraQuantity }) =>
  extraQuantity === 0 && item.sellingPriceWithAssemblies === 0

const AttachmentItem = ({
  productText,
  price,
  assemblyOptions,
  showItemPrice,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const childrenAdded = (assemblyOptions && assemblyOptions.added) || []
  const childrenRemoved = (assemblyOptions && assemblyOptions.removed) || []
  const filteredChildrenAdded = reject(itemShouldHide, childrenAdded)
  const parentColor =
    filteredChildrenAdded.length > 0 || childrenRemoved.length > 0
      ? 'c-on-base'
      : 'c-muted-2'

  return (
    <div className={`${handles.attachmentItemContainer} flex flex-column pv1`}>
      <div className={`${handles.attachmentItem} flex items-center justify-between`}>
        <span className={`${handles.attachmentItemProductText} t-small ${parentColor} tl pr3`}>{productText}</span>
        {price != null && showItemPrice && price > 0 && (
          <ProductPrice
            sellingPrice={price}
            sellingPriceContainerClass="c-on-base"
            sellingPriceLabelClass="dib"
            sellingPriceClass="dib t-small c-muted-2"
            showListPrice={false}
            showLabels={false}
            showInstallments={false}
          />
        )}
      </div>
      <AttachmentChildren
        addedOptions={filteredChildrenAdded}
        removedOptions={childrenRemoved}
      />
    </div>
  )
}

AttachmentItem.propTypes = {
  productText: string.isRequired,
  price: number,
  assemblyOptions: object,
  showItemPrice: bool,
}

export default memo(AttachmentItem)

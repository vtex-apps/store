import React from 'react'
import { productShape } from '../../utils/propTypes'
import { pathOr, reject } from 'ramda'

import RemovedAttachmentsList from '../../components/ProductSummaryAttachmentList/RemovedAttachmentsList'
import AddedAttachmentsList from '../../components/ProductSummaryAttachmentList/AddedAttachmentsList'

import styles from '../../productSummary.css'

const itemShouldHide = ({ item, extraQuantity }) =>
  extraQuantity === 0 && item.sellingPriceWithAssemblies === 0

const AttachmentList = ({ product }) => {
  const addedOptions = pathOr([], ['assemblyOptions', 'added'], product)
  const removedOptions = pathOr([], ['assemblyOptions', 'removed'], product)

  const filteredOption = reject(itemShouldHide, addedOptions)

  if (filteredOption.length === 0 && removedOptions.length === 0) {
    return null
  }

  return (
    <div className={`${styles.attachmentListContainer} pv2`}>
      <AddedAttachmentsList
        addedOptions={filteredOption}
      />
      <RemovedAttachmentsList removedOptions={removedOptions} />
    </div>
  )
}

AttachmentList.propTypes = {
  product: productShape,
}

export default AttachmentList

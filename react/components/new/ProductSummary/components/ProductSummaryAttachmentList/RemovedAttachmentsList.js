import React, { Fragment } from 'react'
import { intlShape, injectIntl } from 'react-intl'
import { arrayOf } from 'prop-types'

import AttachmentItem from './AttachmentItem'

import { removedOptionShape } from '../../utils/propTypes'

const wasCompletelyRemoved = ({ removedQuantity, initialQuantity }) =>
  removedQuantity === 1 && removedQuantity === initialQuantity

const formatAttachmentName = (missingOption, intl) => {
  const { name, removedQuantity } = missingOption
  if (wasCompletelyRemoved(missingOption)) {
    return intl.formatMessage(
      { id: 'store/productSummary.missingOptionName' },
      { name }
    )
  }

  const extraParams = {
    sign: '-',
    name,
    quantity: removedQuantity,
  }
  return intl.formatMessage(
    { id: 'store/productSummary.attachmentName' },
    extraParams
  )
}

const RemovedAttachmentsList = ({ removedOptions, intl }) => {
  if (removedOptions.length === 0) {
    return null
  }

  return (
    <Fragment>
      {removedOptions.map(removedOption => {
        const productText = formatAttachmentName(removedOption, intl)
        return <AttachmentItem productText={productText} key={productText} />
      })}
    </Fragment>
  )
}

RemovedAttachmentsList.propTypes = {
  removedOptions: arrayOf(removedOptionShape).isRequired,
  intl: intlShape,
}

export default injectIntl(RemovedAttachmentsList)

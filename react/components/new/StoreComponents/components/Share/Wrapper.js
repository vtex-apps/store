import React, { useContext } from 'react'
import { ProductContext } from 'vtex.product-context'
import { path, isEmpty } from 'ramda'
import { injectIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import Share from './index'

const ShareWrapper = props => {
  const { intl } = props

  const valuesFromContext = useContext(ProductContext)
  const { account } = useRuntime()

  const shareProps = () => {
    if (!valuesFromContext || isEmpty(valuesFromContext)) {
      return props
    }

    const { selectedItem, product } = valuesFromContext

    const title = intl.formatMessage(
      { id: 'store/share.title' },
      {
        product: path(['productName'], product),
        sku: path(['name'], selectedItem),
        store: account,
      }
    )

    return {
      ...props,
      shareLabelClass: props.shareLabelClass || 'c-muted-2 t-small mb3',
      className: props.className || 'db',
      imageUrl: props.imageUrl || path(['items', 0, 'images', 0, 'imageUrl'], product),
      loading: props.loading != null ? props.loading : !path(['name'], selectedItem),
      title: props.title || title,
    }
  }

  return <Share {...shareProps()} />
}

ShareWrapper.schema = Share.schema

export default injectIntl(ShareWrapper)

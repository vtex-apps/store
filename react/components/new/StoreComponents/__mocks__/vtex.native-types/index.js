import React from 'react'
import { FormattedMessage } from 'react-intl'

export const formatIOMessage = ({ id }) => id

export const IOMessage = props => {
  if (props.id) {
    return <FormattedMessage {...props} />
  }
  if (props['data-testid']) {
    return <div>{props['data-testid']}</div>
  }
  if (props.children) {
    return props.children(null)
  }
  return null
}
  

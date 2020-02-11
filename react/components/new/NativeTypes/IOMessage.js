import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

const IOMessage = ({ children, id, ...props }) => {
  const intlMessage = props.intl.messages[id]

  if (intlMessage) {
    return (
      <FormattedMessage id={id} {...props}>
        {children}
      </FormattedMessage>
    )
  }

  if (children && typeof children === 'function') {
    return children(intlMessage === '' ? '' : id)
  }

  return intlMessage === '' ? null : <>{id}</>
}

export default injectIntl(IOMessage)
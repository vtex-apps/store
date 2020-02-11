import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

const CSS_HANDLES = ['errorMessage'] as const

function ErrorMessage() {
  const handles = useCssHandles(CSS_HANDLES)
  const className = `${handles.errorMessage} c-danger`

  return (
    <FormattedMessage id="store/sku-selector.variation.select-an-option">
      {message => (
        <>{' '}{/* this space is necessary */}
          <span className={className}>
            {message}
          </span>
        </>
      )}
    </FormattedMessage>
  )
}

export default ErrorMessage

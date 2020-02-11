import React, { Fragment } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { injectIntl } from 'react-intl'

export function formatCurrency({ intl, culture, value }) {
  return intl.formatNumber(value, {
    style: 'currency',
    currency: culture.currency,
    ...(culture.customCurrencyDecimalDigits != null
      ? { minimumFractionDigits: culture.customCurrencyDecimalDigits }
      : {}),
  })
}

function BaseFormattedCurrency({ value, intl }) {
  const { culture } = useRuntime()

  const number = intl.formatNumber(value, {
    style: 'currency',
    currency: culture.currency,
    ...(culture.customCurrencyDecimalDigits != null
      ? { minimumFractionDigits: culture.customCurrencyDecimalDigits }
      : {}),
  })

  return <Fragment>{number}</Fragment>
}

export const FormattedCurrency = injectIntl(BaseFormattedCurrency)

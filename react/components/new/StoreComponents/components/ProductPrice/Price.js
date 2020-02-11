import React from 'react'
import { map, join } from 'ramda'
import { injectIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import formatCurrency from '../../../FormatCurrency/formatCurrency'
import FormattedCurrency from '../../../FormatCurrency/FormattedCurrency'

const isValidPriceRange = priceRange => {
  const [lowPrice, highPrice] = priceRange
  return priceRange.length === 2 && lowPrice !== highPrice
}

const formatPriceRange = (intl, culture, rawPriceRange) => {
  const priceRangeFormatted = (rawPriceRange || []).map(value =>
    formatCurrency({ intl, culture, value })
  )

  return priceRangeFormatted.join(' - ')
}

const Price = ({
  showPriceRange,
  priceRange,
  price,
  rangeContainerClasses,
  singleContainerClasses,
  intl,
}) => {
  const { culture } = useRuntime()

  const mustShowPriceRange =
    showPriceRange && priceRange && isValidPriceRange(priceRange)

  if (mustShowPriceRange) {
    return (
      <span className={rangeContainerClasses}>
        {formatPriceRange(intl, culture, priceRange)}
      </span>
    )
  }

  return (
    <span className={singleContainerClasses}>
      <FormattedCurrency value={price} />
    </span>
  )
}

export default injectIntl(Price)

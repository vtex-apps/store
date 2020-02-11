import React, { Component } from 'react'
import { FormattedNumber } from 'react-intl'
import PropTypes from 'prop-types'

import IOMessage from '../../../NativeTypes/IOMessage'

import styles from './styles.css'

const calculateDiscountTax = (listPrice, sellingPrice) => {
  return (listPrice - sellingPrice) / listPrice
}

/**
 * The discount badge component. It receives the product's list and selling prices
 * and calculates the discount percent to show it in the product's sumary.
 */
const DiscountBadge = ({ listPrice, sellingPrice, label = '', children }) => {
  const percent = calculateDiscountTax(listPrice, sellingPrice)
  const shouldShowPercentage = percent && percent >= 0.01

  return (
    <div className={`${styles.discountContainer} relative dib`}>
      {shouldShowPercentage ? (
        <div
          className={`${styles.discountInsideContainer} t-mini white absolute right-0 pv2 ph3 bg-emphasis z-1`}
        >
          <IOMessage id={label}>
            {labelValue => (
              <>
                {!labelValue && '-'}
                <FormattedNumber value={percent} style="percent" />{' '}
                {labelValue && ' '}
                {labelValue && <span>{labelValue}</span>}
              </>
            )}
          </IOMessage>
        </div>
      ) : null}
      {children}
    </div>
  )
}

DiscountBadge.propTypes = {
  /** The product's default price */
  listPrice: PropTypes.number.isRequired,
  /** The product's price with discount */
  sellingPrice: PropTypes.number.isRequired,
  /** Label to track the discount percent */
  label: PropTypes.string,
  /** Image element */
  children: PropTypes.node.isRequired,
}

export default DiscountBadge

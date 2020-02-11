import React, { Fragment } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { injectIntl } from 'react-intl'
import classNames from 'classnames'
import { isEmpty } from 'ramda'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import formatCurrency from '../../../FormatCurrency/formatCurrency'

import PricePropTypes from './propTypes'

import productPrice from './styles.css'

/** Installments component */
const Installments = ({
  showLabels,
  installments = [],
  className,
  installmentClass,
  interestRateClass,
  intl,
}) => {
  const { culture } = useRuntime()

  if (
    !installments ||
    isEmpty(
      installments.filter(
        ({ NumberOfInstallments }) => NumberOfInstallments > 1
      )
    )
  ) {
    return null
  }

  const noInterestRateInstallments = installments.filter(
    installment =>
      !installment.InterestRate && installment.NumberOfInstallments > 1
  )

  /*
   * - The selected installment will be the one with the highest `NumberOfInstallments`;
   * - If there is no 'interest-free' installments, the normal installments will be analyzed.
   */
  const installment = (isEmpty(noInterestRateInstallments)
    ? installments
    : noInterestRateInstallments
  ).reduce((previous, current) =>
    previous.NumberOfInstallments > current.NumberOfInstallments
      ? previous
      : current
  )

  const formattedInstallmentPrice = formatCurrency({
    intl,
    culture,
    value: installment.Value,
  })

  const [installmentsElement, installmentPriceElement, timesElement] = [
    installment.NumberOfInstallments,
    formattedInstallmentPrice,
    <Fragment key="x">x</Fragment>,
  ].map((element, index) => (
    <span className={installmentClass} key={index}>
      {element}
    </span>
  ))

  return (
    <div className={classNames(productPrice.installmentsPrice, className)}>
      {showLabels ? (
        <FormattedMessage
          id="store/pricing.installment-display"
          values={{
            installments: installmentsElement,
            installmentPrice: installmentPriceElement,
            times: timesElement,
          }}
        />
      ) : (
        <Fragment>
          {installmentsElement}
          {timesElement} {installmentPriceElement}
        </Fragment>
      )}
      {!installment.InterestRate && (
        <div
          className={classNames(
            productPrice.interestRatePrice,
            interestRateClass
          )}
        >
          <FormattedMessage id="store/pricing.interest-free" />
        </div>
      )}
    </div>
  )
}

Installments.propTypes = {
  /** Classes to be applied to the root element */
  className: PropTypes.string,
  /** Classes to be applied to installment value element */
  installmentClass: PropTypes.string,
  /** Classes to be applied to interest rate element */
  interestRateClass: PropTypes.string,
  /** Product installments to be displayed */
  installments: PricePropTypes.installments,
  /** Pages editor config to display labels */
  showLabels: PropTypes.bool.isRequired,
}

export default injectIntl(Installments)

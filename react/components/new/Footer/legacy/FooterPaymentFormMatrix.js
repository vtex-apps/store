import PropTypes from 'prop-types'
import React, { Component } from 'react'

import FooterPaymentFormList from './FooterPaymentFormList'

import footer from './footer.css'

export default class FooterPaymentFormMatrix extends Component {
  static propTypes = {
    /** Payment forms array */
    paymentForms: PropTypes.arrayOf(
      PropTypes.shape({
        /** Payment form title */
        title: PropTypes.string,
        /** Payment types */
        paymentTypes: PropTypes.arrayOf(PropTypes.string.isRequired),
      })
    ),
    /** Determines if the icons are colorful */
    showPaymentFormsInColor: PropTypes.bool,
  }

  render() {
    const { paymentForms, ...otherProps } = this.props

    return (
      paymentForms && (
        <div className={`${footer.paymentMatrix} flex flex-wrap`}>
          {paymentForms.map((paymentFormsItem, index) => (
            <div
              key={`payment-container-${index}`}
              className={footer.paymentMatrixItem}
            >
              <FooterPaymentFormList
                horizontal
                titleId={paymentFormsItem.title}
                list={paymentFormsItem.paymentTypes.map(paymentType => ({
                  paymentType,
                }))}
                {...otherProps}
              />
            </div>
          ))}
        </div>
      )
    )
  }
}

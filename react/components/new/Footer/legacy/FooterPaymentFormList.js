import React from 'react'
import PropTypes from 'prop-types'

import footerList from './footerList'
import withImage from '../components/withImage'
import footer from './footer.css'

/**
 * Shows an image for the payments forms accepted
 */
const FooterPaymentFormItem = ({ imageSrc }) => {
  if (!imageSrc) {
    return null
  }

  return (
    <img className={`${footer.paymentFormItem} pr0 w2 h2`} src={imageSrc} />
  )
}

FooterPaymentFormItem.displayName = 'FooterPaymentFormItem'

FooterPaymentFormItem.propTypes = {
  /** Indicates which one of the payments forms should the component show its image */
  paymentType: PropTypes.string.isRequired,
  /** If true, the original logo (with color) is used. If not, the grayscale's one */
  showInColor: PropTypes.bool.isRequired,
}

const getImagePathFromProps = ({ paymentType, showInColor }) =>
  `${paymentType.toLowerCase()}${showInColor ? '' : '-bw'}.svg`

export default footerList(
  withImage(getImagePathFromProps)(FooterPaymentFormItem)
)

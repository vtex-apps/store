import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const MAX_SIZE_DESCRIPTION = 120

const ProductSummaryDescription = ({ descriptionClasses, description }) => {
  if (!description) return <Fragment />

  const descriptionTruncated =
    description.length > MAX_SIZE_DESCRIPTION
      ? `${description.substring(0, MAX_SIZE_DESCRIPTION)}...`
      : description

  return <span className={descriptionClasses}>{descriptionTruncated}</span>
}

ProductSummaryDescription.propTypes = {
  /** Styles used in the description */

  descriptionClasses: PropTypes.string.isRequired,
  /** Description of the product */

  description: PropTypes.string,
}

export default ProductSummaryDescription

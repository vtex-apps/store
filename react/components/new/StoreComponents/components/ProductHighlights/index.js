import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import HtmlParser from 'react-html-parser'

import styles from './styles.css'

/**
 * Product highlights Component.
 * Render the highlights specifications of a product.
 */
const ProductHighlights = ({ ...props }) => {
  const { highlights } = props
  return (
    <div className={`${styles.highlightContent} pt3 pb5`}>
      {highlights.map((item, i) => (
        <div
          className={`${styles.itemHighlight} pv2`}
          data-name={item.name}
          data-value={item.values[0]}
          key={i}
        >
          <span
            className={`${styles.highlightTitle} t-body c-on-base fw7 pr3 `}
          >
            {HtmlParser(item.name)}
            {': '}
          </span>
          <span
            className={`${styles.highlightValue} t-body c-muted-1 lh-copy `}
          >
            {HtmlParser(item.values[0])}
          </span>
        </div>
      ))}
    </div>
  )
}

ProductHighlights.defaultProps = {
  highlights: [],
}

ProductHighlights.propTypes = {
  /** Intl object to provides internationalization */
  intl: intlShape.isRequired,
  /** Specifications that will be displayed on the table */
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      /** Highlight name */
      name: PropTypes.string.isRequired,
      /** Highlight value */
      values: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
}

export default injectIntl(ProductHighlights)

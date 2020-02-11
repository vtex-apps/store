import React, { Component } from 'react'
import { path } from 'ramda'
import classNames from 'classnames'
import { Link } from 'vtex.render-runtime'

import AttachmentList from './AttachmentList'
import ProductImage from './ProductImage'
import ProductSummaryBuyButton from './ProductSummaryBuyButton'
import ProductSummaryPrice from './ProductSummaryPrice'
import ProductSummaryName from './ProductSummaryName'

import styles from '../../productSummary.css'

class ProductSummarySmall extends Component {
  render() {
    const {
      product,
      showBorders,
      handleMouseEnter,
      handleMouseLeave,
      actionOnClick,
      imageProps,
      nameProps,
      priceProps,
      buyButtonProps,
    } = this.props

    const containerClasses = classNames(
      styles.container,
      styles.containerSmall,
      'overflow-hidden br3 h-100 flex flex-column justify-between center tc'
    )

    const summaryClasses = classNames(
      styles.element,
      'pointer pt3 pb4 flex flex-column',
      {
        'bb b--muted-4 mh2 mt2': showBorders,
      }
    )

    const nameClasses = {
      containerClass: `flex items-start ${styles.nameContainer} justify-center pv5 t-mini pb2`,
      brandNameClass: 't-body t-mini',
    }

    const priceClasses = {
      containerClass: classNames('flex flex-column justify-end items-center', {
        [`${styles.priceContainer} pv5`]: !showBorders,
      }),
      sellingPriceClass: 'dib ph2 t-body t-heading-5-ns',
    }

    const buyButtonClasses = {
      containerClass: `${styles.buyButtonContainer} pv3 w-100 dn`,
    }

    return (
      <section
        className={containerClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          className={`${styles.clearLink} flex flex-column`}
          page={'store.product'}
          params={{ slug: path(['linkText'], product) }}
          onClick={actionOnClick}
        >
          <article className={summaryClasses}>
            <div className={`${styles.imageContainer} db w-100 center`}>
              <ProductImage {...imageProps} />
            </div>
            <div className={styles.information}>
              <ProductSummaryName {...nameProps} {...nameClasses} />
              <AttachmentList product={product} />
              <div>
                <ProductSummaryPrice {...priceProps} {...priceClasses} />
              </div>
            </div>
          </article>
          <ProductSummaryBuyButton {...buyButtonProps} {...buyButtonClasses} />
        </Link>
      </section>
    )
  }
}

export default ProductSummarySmall

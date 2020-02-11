import React from 'react'
import classNames from 'classnames'
import ContentLoader from 'react-content-loader'
import productPrice from './styles.css'

const ProductPriceLoader = (loaderProps = {}) => {
  const { loaderClass, ...props } = loaderProps
  return (
    <div
      className={classNames(
        productPrice.priceContainer,
        productPrice.priceLoaderContainer,
        loaderClass
      )}
    >
      <ContentLoader
        style={{
          width: '100%',
          height: '100%',
        }}
        width={300}
        height={70}
        preserveAspectRatio="xMinYMin meet"
        {...props}
      >
        <rect
          height="0.75em"
          width="50%"
          x="25%"
          {...loaderProps[productPrice.listPriceLoader]}
        />
        <rect {...loaderProps[productPrice.sellingPriceLabelLoader]} />
        <rect
          height="1em"
          width="70%"
          x="15%"
          y="1.25em"
          {...loaderProps[productPrice.sellingPriceLoader]}
        />
        <rect
          height="0.75em"
          width="80%"
          x="10%"
          y="2.75em"
          {...loaderProps[productPrice.installmentsPriceLoader]}
        />
        <rect {...loaderProps[productPrice.savingsPriceLoader]} />
      </ContentLoader>
    </div>
  )
}

export default ProductPriceLoader

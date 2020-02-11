import PropTypes from 'prop-types'
import React from 'react'
import ContentLoader from 'react-content-loader'
import classNames from 'classnames'
import useCssHandles from '../../../CssHandles/useCssHandles'

const CSS_HANDLES = [
  'productNameContainer',
  'productBrand',
  'productSku',
  'productReference',
  'productNameLoader',
  'productNameBrandLoader',
  'productNameSkuLoader',
]

/**
 * Name component. Show name and relevant SKU information of the Product Summary
 */
const ProductName = ({
  productReferenceClass,
  brandNameClass,
  skuNameClass,
  loaderClass,
  className,
  name,
  styles,
  skuName,
  showSku = false,
  brandName,
  showBrandName = false,
  productReference,
  showProductReference = false,
  tag: Wrapper = 'div',
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  const Loader = (loaderProps = {}) => (
    <div
      className={classNames(
        handles.productNameContainer,
        handles.productNameLoader,
        loaderProps.className
      )}
    >
      <ContentLoader
        style={{
          width: '100%',
          height: '100%',
        }}
        width={456}
        height={100}
        preserveAspectRatio="xMinYMin meet"
        {...loaderProps}
      >
        <rect
          height="1.125em"
          width="75%"
          x="15%"
          {...loaderProps[handles.productNameBrandLoader]}
        />
        <rect
          height="1.125em"
          width="50%"
          x="25%"
          y="1.75em"
          {...loaderProps[handles.productNameSkuLoader]}
        />
      </ContentLoader>
    </div>
  )

  if (!name) {
    return <Loader className={loaderClass} {...styles} />
  }

  return (
    <Wrapper
      className={classNames(handles.productNameContainer, 'mv0', className)}
    >
      <span className={classNames(handles.productBrand, brandNameClass)}>
        {name} {showBrandName && brandName && `- ${brandName}`}
      </span>
      {showSku && skuName && (
        <span className={classNames(handles.productBrand, skuNameClass)}>
          {skuName}
        </span>
      )}
      {showProductReference && productReference && (
        <span
          className={classNames(
            handles.productReference,
            productReferenceClass
          )}
        >
          {`REF: ${productReference}`}
        </span>
      )}
    </Wrapper>
  )
}

ProductName.propTypes = {
  /** Name of the product */
  name: PropTypes.string,
  /** Selected SKU name */
  skuName: PropTypes.string,
  /** Show sku */
  showSku: PropTypes.bool,
  /** Product reference */
  productReference: PropTypes.string,
  /** Show product reference */
  showProductReference: PropTypes.bool,
  /** Brand name */
  brandName: PropTypes.string,
  /** Show brand name */
  showBrandName: PropTypes.bool,
  /** Component and content loader styles */
  styles: PropTypes.object,
  /** Classes to be applied to root element */
  className: PropTypes.string,
  /** Classes to be applied to brandName element */
  brandNameClass: PropTypes.string,
  /** Classes to be applied to skuName element */
  skuNameClass: PropTypes.string,
  /** Classes to be applied to productReference element */
  productReferenceClass: PropTypes.string,
  /** Classes to be applied to loader root element */
  loaderClass: PropTypes.string,
  /** HTML tag to be used in the component container */
  tag: PropTypes.oneOf(['div', 'h1', 'h2', 'h3']),
}

export default ProductName

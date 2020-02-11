import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import IOMessage from '../../NativeTypes/IOMessage'
import useCssHandles from '../../CssHandles/useCssHandles'

import {
  productListSchemaPropTypes,
  shelfItemPropTypes,
} from '../utils/propTypes'
import ScrollTypes from '../utils/ScrollTypes'
import GapPaddingTypes from '../utils/paddingEnum'
import ShelfContent from './ShelfContent'
import ProductListEventCaller from './ProductListEventCaller'

const CSS_HANDLES = ['title']

const DEFAULT_MAX_ITEMS = 10
const DEFAULT_ITEMS_PER_PAGE = 5
const DEFAULT_MIN_ITEMS_PER_PAGE = 1

/**
 * Product List Component. Shows a collection of products.
 */
const ProductList = ({
  gap,
  arrows,
  scroll,
  summary,
  maxItems,
  products,
  isMobile,
  autoplay,
  showTitle,
  titleText,
  itemsPerPage,
  minItemsPerPage,
  paginationDotsVisibility,
  navigationStep: navigationStepProp,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const navigationStep = isNaN(parseInt(navigationStepProp)) ? navigationStepProp : parseInt(navigationStepProp)

  return products && !products.length ? null : (
    <Fragment>
      {showTitle && (
        <div
          className={`${handles.title} t-heading-2 fw3 w-100 flex justify-center pt7 pb6 c-muted-1`}
        >
          <IOMessage id={titleText} />
        </div>
      )}
      <ReactResizeDetector handleWidth>
        {width => (
          <ShelfContent
            gap={gap}
            width={width}
            arrows={arrows}
            scroll={scroll}
            summary={summary}
            products={products}
            maxItems={maxItems}
            isMobile={isMobile}
            autoplay={autoplay}
            itemsPerPage={itemsPerPage}
            navigationStep={navigationStep}
            minItemsPerPage={minItemsPerPage}
            paginationDotsVisibility={paginationDotsVisibility}
          />
        )}
      </ReactResizeDetector>
      <ProductListEventCaller />
    </Fragment>
  )
}

ProductList.defaultProps = {
  maxItems: DEFAULT_MAX_ITEMS,
  minItemsPerPage: DEFAULT_MIN_ITEMS_PER_PAGE,
  itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
  scroll: ScrollTypes.BY_PAGE.value,
  gap: GapPaddingTypes.SMALL.value,
  arrows: true,
  showTitle: true,
  titleText: null,
  isMobile: false,
}

ProductList.propTypes = {
  /** Loading status */
  loading: PropTypes.bool,
  /** Graphql data response. */
  products: PropTypes.arrayOf(shelfItemPropTypes.item),
  /** Verifies if is a mobile device. */
  isMobile: PropTypes.bool,
  /** Should display navigation dots below the Shelf */
  paginationDotsVisibility: PropTypes.oneOf([
    'visible',
    'hidden',
    'desktopOnly',
    'mobileOnly',
  ]),
  ...productListSchemaPropTypes,
}

ProductList.schema = {
  title: 'admin/editor.shelf.title',
}

export default ProductList

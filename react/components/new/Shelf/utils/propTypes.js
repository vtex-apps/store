import PropTypes from 'prop-types'

import { getScrollValues } from './ScrollTypes'
import { getGapPaddingValues } from './paddingEnum'

export const shelfItemPropTypes = {
  item: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    categories: PropTypes.array,
    link: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    brandId: PropTypes.number,
    brand: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        itemId: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        referenceId: PropTypes.arrayOf(
          PropTypes.shape({
            Value: PropTypes.string.isRequired,
          })
        ),
        images: PropTypes.arrayOf(
          PropTypes.shape({
            imageUrl: PropTypes.string.isRequired,
            imageTag: PropTypes.string.isRequired,
          })
        ).isRequired,
        sellers: PropTypes.arrayOf(
          PropTypes.shape({
            commertialOffer: PropTypes.shape({
              /** SKU installments */
              Installments: PropTypes.arrayOf(
                PropTypes.shape({
                  /** Installment value */
                  Value: PropTypes.number.isRequired,
                  /** Interest rate (zero if interest-free) */
                  InterestRate: PropTypes.number.isRequired,
                  /** Calculated total value */
                  TotalValuePlusInterestRate: PropTypes.number,
                  /** Number of installments */
                  NumberOfInstallments: PropTypes.number.isRequired,
                  /** Installments offer name */
                  Name: PropTypes.string,
                })
              ),
              Price: PropTypes.number.isRequired,
              ListPrice: PropTypes.number.isRequired,
            }).isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }),
  summary: PropTypes.any,
  position: PropTypes.number,
}

export const productListSchemaPropTypes = {
  /** Maximum number of items in the shelf. */
  maxItems: PropTypes.number.isRequired,
  /** Maximum number of items in a page. */
  itemsPerPage: PropTypes.number.isRequired,
  /** Minimum number of items in a page. */
  minItemsPerPage: PropTypes.number,
  /** Scroll options. */
  scroll: PropTypes.oneOf(getScrollValues()),
  /** If the arrows are showable or not. */
  arrows: PropTypes.bool.isRequired,
  /** Show value of the title. */
  showTitle: PropTypes.bool,
  /** Text value of the title. */
  titleText: PropTypes.string,
  /** Product Summary schema props */
  summary: PropTypes.any,
}

export const shelfContentPropTypes = {
  /** List of products */
  products: PropTypes.arrayOf(shelfItemPropTypes.item),
  /** Max Items per page */
  itemsPerPage: PropTypes.number,
  /** Minimum Items per page */
  minItemsPerPage: PropTypes.number,
  /** Max items in shelf */
  maxItems: PropTypes.number.isRequired,
  /** Show Arrows */
  arrows: PropTypes.bool.isRequired,
  /** Scroll type */
  scroll: PropTypes.string.isRequired,
  /** Should display navigation dots below the Shelf */
  paginationDotsVisibility: PropTypes.oneOf([
    'visible',
    'hidden',
    'desktopOnly',
    'mobileOnly',
  ]),
  /** Container width */
  width: PropTypes.number,
  /** Props to ProductsSummary */
  summary: PropTypes.any,
  /** Is mobile */
  isMobile: PropTypes.bool,
  /** Gap between Shelf Items */
  gap: PropTypes.oneOf(getGapPaddingValues()),
}

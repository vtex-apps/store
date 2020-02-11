import PropTypes from 'prop-types'
import { CHOICE_TYPES } from './attachmentHelper'

export const addedOptionShape = PropTypes.shape({
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    sellingPrice: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }),
  normalizedQuantity: PropTypes.number,
  extraQuantity: PropTypes.number,
  choiceType: PropTypes.oneOf([
    CHOICE_TYPES.SINGLE,
    CHOICE_TYPES.MULTIPLE,
    CHOICE_TYPES.TOGGLE,
  ]).isRequired,
})

export const removedOptionShape = PropTypes.shape({
  removedQuantity: PropTypes.number.isRequired,
  initialQuantity: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
})

export const productShape = PropTypes.shape({
  /** Product's id */
  productId: PropTypes.string.isRequired,
  /** Product's link text */
  linkText: PropTypes.string.isRequired,
  /** Product's name */
  productName: PropTypes.string.isRequired,
  /** Product's brand */
  brand: PropTypes.string,
  /** Product's brand id */
  brandId: PropTypes.number,
  /** Product's SKU */
  sku: PropTypes.shape({
    /** SKU name */
    name: PropTypes.string.isRequired,
    /** SKU id */
    itemId: PropTypes.string.isRequired,
    /** SKU Image to be shown */
    image: PropTypes.shape({
      /** Image URL */
      imageUrl: PropTypes.string.isRequired,
      /** Image tag as string */
      imageTag: PropTypes.string,
    }).isRequired,
    /** SKU seller */
    seller: PropTypes.shape({
      /** Seller id */
      sellerId: PropTypes.string,
      /** Seller comertial offer */
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
        /** Selling Price */
        Price: PropTypes.number.isRequired,
        /** List Price */
        ListPrice: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  /** Product's collections */
  productClusters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ),
  /** Contains relevant assembly options information */
  assemblyOptions: PropTypes.shape({
    added: PropTypes.arrayOf(addedOptionShape),
    removed: PropTypes.arrayOf(removedOptionShape),
    parentPrice: PropTypes.number,
  }),
  /** Quantity of item in Minicart */
  quantity: PropTypes.number,
})

import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'

export default {
  /** Product list of selling prices */
  sellingPriceList: PropTypes.arrayOf(PropTypes.number),
  /** Product list of list prices */
  listPriceList: PropTypes.arrayOf(PropTypes.number),
  /** Product selling price */
  sellingPrice: PropTypes.number,
  /** Product list price */
  listPrice: PropTypes.number,
  /** Set visibility of selling prices range */
  showSellingPriceRange: PropTypes.bool.isRequired,
  /** Set visibility of list prices range */
  showListPriceRange: PropTypes.bool.isRequired,
  /** Set visibility of list price */
  showListPrice: PropTypes.bool.isRequired,
  /** Set visibility of labels */
  showLabels: PropTypes.bool.isRequired,
  /** Set visibility of installments */
  showInstallments: PropTypes.bool.isRequired,
  /** Set visibility of savings */
  showSavings: PropTypes.bool,
  /** Text to the selling price's label */
  labelSellingPrice: PropTypes.string,
  /** Text to the list price's label */
  labelListPrice: PropTypes.string,
  /** Available installments */
  installments: PropTypes.arrayOf(
    PropTypes.shape({
      /** Installment value */
      Value: PropTypes.number.isRequired,
      /** Interest rate (zero if interest-free) */
      InterestRate: PropTypes.number.isRequired,
      /** Calculated total value */
      TotalValuePlusInterestRate: PropTypes.number,
      /** Number of installments */
      NumberOfInstallments: PropTypes.number.isRequired,
      /** Installment offer name */
      Name: PropTypes.string,
    })
  ),
  /** Classes to be applied to root element */
  className: PropTypes.string,
  /** Classes to be applied to loader root element */
  loaderClass: PropTypes.string,
  /** Classes to be applied to container of list price */
  listPriceContainerClass: PropTypes.string,
  /** Classes to be applied to label of price */
  listPriceLabelClass: PropTypes.string,
  /** Classes to be applied to price value */
  listPriceClass: PropTypes.string,
  /** Classes to be applied to range selling prices value */
  sellingPriceRangeClass: PropTypes.string,
  /** Classes to be applied to range list prices value */
  listPriceRangeClass: PropTypes.string,
  /** Classes to be applied to selling price container */
  sellingPriceContainerClass: PropTypes.string,
  /** Classes to be applied to selling price label */
  sellingPriceLabelClass: PropTypes.string,
  /** Classes to be applied to selling price value */
  sellingPriceClass: PropTypes.string,
  /** Classes to be applied to savings container */
  savingsContainerClass: PropTypes.string,
  /** Classes to be applied to savings */
  savingsClass: PropTypes.string,
  /** Classes to be applied to installment element */
  installmentClass: PropTypes.string,
  /** Classes to be applied to installment container */
  installmentContainerClass: PropTypes.string,
  /** Classes to be applied to interest rate element */
  interestRateClass: PropTypes.string,
  /** Component and content loader styles */
  styles: PropTypes.object,
  /** intl property to format data */
  intl: intlShape.isRequired,
}
